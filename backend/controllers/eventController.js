const { uploadToS3, listS3Objects, deleteFromS3 } = require("../utils/s3");
const { Event, Category } = require("../models/event");
const {
    URL_RE,
    isValidId,
    isNonEmptyString,
    validateOrganizer,
    validateSeo,
    validateRestrictions,
    validatePricing,
    validateDuration,
    validateBooking,
    validateSchedule,
} = require("../utils/eventValidator");

const JSON_FIELDS = [
    "pricing",
    "booking",
    "schedule",
    "duration",
    "organizer",
    "restrictions",
    "seo",
];

const extractS3Key = (url) => {
    if (!url) return null;
    const relMatch = url.match(/^\/api\/media\/(.+)$/);
    if (relMatch) return relMatch[1];

    try {
        return new URL(url).pathname.split("/").slice(2).join("/") || null;
    } catch {
        return null;
    }
};

const parseJsonFields = (body) => {
    const data = {};
    for (const field of JSON_FIELDS) {
        if (body[field] === undefined) {
            return {
                error: {
                    status: 400,
                    message: `${field} is required`,
                    code: "DATA_MISSING",
                },
            };
        }

        try {
            data[field] = JSON.parse(body[field]);
        } catch {
            return {
                error: {
                    status: 400,
                    message: `${field} contains invalid JSON`,
                    code: "INVALID_JSON",
                },
            };
        }
    }

    return { data };
};

const normalizeEventFields = (event) => {
    if (event.booking.type === "request") {
        const { ticketUrl, ...rest } = event.booking;
        event.booking = rest;
    }

    event.schedule.isSubscription = event.schedule.dates.length > 1;
};

const uploadMedia = async (files) => {
    const [cover, gallery] = await Promise.all([
        files?.cover?.[0]
            ? uploadToS3(files.cover[0], "cover")
            : Promise.resolve(""),
        files?.gallery
            ? Promise.all(files.gallery.map((f) => uploadToS3(f, "gallery")))
            : Promise.resolve([]),
    ]);

    if (!cover) {
        return {
            error: {
                status: 400,
                message: "Cover image is required",
                code: "COVER_IMAGE_MISSING",
            },
        };
    }

    return { media: { cover, gallery } };
};

class EventController {
    async postEvent(req, res) {
        try {
            // 1. Скалярные поля
            if (
                !isNonEmptyString(req.body.title) ||
                !isNonEmptyString(req.body.description) ||
                !isValidId(req.body.category) ||
                typeof req.body.cancellationPolicy !== "string"
            ) {
                return res.status(400).json({
                    message:
                        "'title', 'description', 'category' or 'cancellationPolicy' are invalid",
                    error: "INVALID_DATA",
                });
            }

            // 2. JSON fields
            const { data: parsed, error: parseError } = parseJsonFields(
                req.body,
            );
            if (parseError) {
                return res
                    .status(parseError.status)
                    .json({
                        message: parseError.message,
                        error: parseError.code,
                    });
            }

            const newEvent = {
                title: req.body.title,
                description: req.body.description,
                category: req.body.category,
                cancellationPolicy: req.body.cancellationPolicy,
                ...parsed,
            };

            //3. Validation
            const simpleChecks = [
                [validateOrganizer(newEvent.organizer), "INVALID_ORGANIZER"],
                [
                    validateRestrictions(newEvent.restrictions),
                    "INVALID_RESTRICTIONS",
                ],
                [validateSeo(newEvent.seo), "INVALID_SEO"],
                [validatePricing(newEvent.pricing), "INVALID_PRICING"],
                [validateDuration(newEvent.duration), "INVALID_DURATION"],
                [
                    validateSchedule(newEvent.booking.type, newEvent.schedule),
                    "INVALID_SCHEDULE",
                ],
            ];

            for (const [message, error] of simpleChecks) {
                if (message) return res.status(400).json({ message, error });
            }

            const bookingError = validateBooking(newEvent.booking);
            if (bookingError) return res.status(400).json(bookingError);

            normalizeEventFields(newEvent);

            const { media, error: mediaError } = await uploadMedia(req.files);

            if (mediaError) {
                return res
                    .status(mediaError.status)
                    .json({
                        message: mediaError.message,
                        error: mediaError.code,
                    });
            }
            newEvent.media = media;

            const event = await new Event(newEvent).save();

            // const event = new Event(newEvent);
            // await event.save();

            return res.status(201).json(event);
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                message: "Internal server error",
                error: "SERVER_ERROR",
            });
        }
    }

    // event/files?prefix=cover/
    async getFiles(req, res) {
        try {
            const files = await listS3Objects(req.query.prefix ?? "");
            return res.status(200).json(files);
        } catch (e) {
            console.error(e);
            return res.status(500).json({
                message: "Internal server error",
                error: "SERVER_ERROR",
            });
        }
    }

    async deleteFiles(req, res) {
        try {
            const { keys } = req.body;

            if (!Array.isArray(keys) || keys.length === 0) {
                return res.status(400).json({
                    message: "keys must be a non-empty array",
                    error: "INVALID_KEYS",
                });
            }

            if (keys.some((k) => typeof k !== "string" || !k.trim())) {
                return res.status(400).json({
                    message: "All keys must be non-empty strings",
                    error: "INVALID_KEYS",
                });
            }

            await Promise.all(
                keys.map((key) => deleteFromS3(extractS3Key(key))),
            );

            return res
                .status(200)
                .json({ message: "Files deleted", deleted: keys });
        } catch (e) {
            console.error(e);
            return res.status(500).json({
                message: "Internal server error",
                error: "SERVER_ERROR",
            });
        }
    }

    async deleteEvent(req, res) {
        try {
            const { id } = req.params;
            if (!isValidId(id)) {
                return res
                    .status(400)
                    .json({ message: "Invalid event id", error: "INVALID_ID" });
            }

            const event = await Event.findById(id);
            if (!event) {
                return res
                    .status(404)
                    .json({
                        message: "Event not found",
                        error: "EVENT_MISSING",
                    });
            }

            const s3Keys = [event.media.cover, ...event.media.gallery]
                .map((url) => extractS3Key(url))
                .filter(Boolean);

            await Promise.all(s3Keys.map((key) => deleteFromS3(key)));

            await event.deleteOne();

            return res.status(200).json({ message: "Event deleted" });
        } catch (e) {
            console.error(e);
            return res.status(500).json({
                message: "Internal server error",
                error: "SERVER_ERROR",
            });
        }
    }

    async updateEvent(req, res) {
        try {
            const { id } = req.params;
            if (!isValidId(id)) {
                return res
                    .status(400)
                    .json({ message: "Invalid event id", error: "INVALID_ID" });
            }

            const event = await Event.findById(id);
            if (!event) {
                return res
                    .status(404)
                    .json({
                        message: "Event not found",
                        error: "EVENT_MISSING",
                    });
            }

            const changes = {};

            for (const field of [
                "title",
                "description",
                "cancellationPolicy",
            ]) {
                if (isNonEmptyString(req.body[field])) {
                    changes[field] = req.body[field];
                }
            }

            if (isValidId(req.body.category)) {
                changes.category = req.body.category;
            }

            // JSON

            for (const field of JSON_FIELDS) {
                if (req.body[field] !== undefined) {
                    try {
                        changes[field] = JSON.parse(req.body[field]);
                    } catch (e) {
                        return res.status(400).json({
                            message: `Invalid JSON in '${field}'`,
                            error: "INVALID_JSON",
                        });
                    }
                }
            }

            if (
                changes?.booking?.type &&
                changes.booking.type !== event.booking.type
            ) {
                return res.status(400).json({
                    message: "'booking.type' cannot be changed",
                    error: "BOOKING_TYPE_IRREPLACEABLE",
                });
            }

            const allChecks = [
                changes.organizer
                    ? [
                          validateOrganizer(changes.organizer),
                          "INVALID_ORGANIZER",
                      ]
                    : null,
                changes.restrictions
                    ? [
                          validateRestrictions(changes.restrictions),
                          "INVALID_RESTRICTIONS",
                      ]
                    : null,
                changes.seo ? [validateSeo(changes.seo), "INVALID_SEO"] : null,
                changes.pricing
                    ? [validatePricing(changes.pricing), "INVALID_PRICING"]
                    : null,
                changes.duration
                    ? [validateDuration(changes.duration), "INVALID_DURATION"]
                    : null,
                changes.booking
                    ? [validateBooking(changes.booking), "INVALID_BOOKING"]
                    : null,
                changes.schedule
                    ? [
                          validateSchedule(
                              changes?.booking?.type || event.booking.type,
                              changes.schedule,
                          ),
                          "INVALID_SCHEDULE",
                      ]
                    : null,
            ];

            for (const check of allChecks) {
                if (!check) continue;
                const [message, error] = check;
                if (message) return res.status(400).json({ message, error });
            }

            if (changes.booking || changes.schedule) {
                const target = {
                    booking: changes.booking ?? event.booking.toObject(),
                    schedule: changes.schedule ?? event.schedule.toObject(),
                };
                normalizeEventFields(target);

                if (changes.booking) changes.booking = target.booking;
                if (changes.schedule) changes.schedule = target.schedule;
            }

            if (req.files?.cover?.[0]) {
                const oldKey = extractS3Key(event.media.cover);
                if (oldKey) await deleteFromS3(oldKey);
                changes["media.cover"] = await uploadToS3(
                    req.files.cover[0],
                    "cover",
                );
            }
            if (req.files?.gallery?.length) {
                const oldKeys = event.media.gallery
                    .map((key) => extractS3Key(key))
                    .filter(Boolean);
                await Promise.all(oldKeys.map((key) => deleteFromS3(key)));
                changes["media.gallery"] = await Promise.all(
                    req.files.gallery.map((file) =>
                        uploadToS3(file, "gallery"),
                    ),
                );
            }

            const editedEvent = await Event.findByIdAndUpdate(
                id,
                { $set: changes },
                { new: true },
            );

            return res.status(200).json(changes);
        } catch (e) {
            console.error(e);
            return res.status(500).json({
                message: "Internal server error",
                error: "SERVER_ERROR",
            });
        }
    }

    async getEvents(req, res) {
        try {
            const events = await Event.find();
            return res.status(200).json(events);
        } catch (e) {
            console.error(e);
            return res.status(500).json({
                message: "Internal server error",
                error: "SERVER_ERROR",
            });
        }
    }

    async getCategories(req, res) {
        try {
            const categories = await Category.find();
            return res.status(200).json(categories);
        } catch (e) {
            console.error(e);
            return res.status(500).json({
                message: "Internal server error",
                error: "SERVER_ERROR",
            });
        }
    }

    async postCategory(req, res) {
        try {
            const { label, slug } = req.body ?? {};

            if (!isNonEmptyString(label) || !isNonEmptyString(slug)) {
                return res.status(400).json({
                    message: "'label' or 'slug' are invalid",
                    error: "INVALID_DATA",
                });
            }

            const exists = await Category.findOne({ slug });

            if (exists) {
                return res.status(409).json({
                    message: "category already exists",
                    error: "CATEGORY_EXISTS",
                });
            }

            const category = new Category({ slug, label });
            await category.save();

            return res.status(201).send(category);
        } catch (e) {
            console.error(e);
            return res.status(500).json({
                message: "Internal server error",
                error: "SERVER_ERROR",
            });
        }
    }

    async deleteCategory(req, res) {
        try {
            const { id } = req.params;

            if (!isValidId(id)) {
                return res
                    .status(400)
                    .json({
                        message: "Invalid category id",
                        error: "INVALID_ID",
                    });
            }

            const hasEvents = await Event.exists({ category: id });
            if (hasEvents) {
                return res.status(409).json({
                    message:
                        "Category contains events and therefore cannot be deleted",
                    error: "DELETION_PROHIBITED",
                });
            }

            await Category.findByIdAndDelete(id);

            return res.status(200).json({
                message: "Category was deleted",
            });
        } catch (e) {
            console.error(e);
            return res.status(500).json({
                message: "Internal server error",
                error: "SERVER_ERROR",
            });
        }
    }

    async changeCategory(req, res) {
        try {
            const { id } = req.params;

            if (!isValidId(id)) {
                return res
                    .status(400)
                    .json({
                        message: "Invalid category id",
                        error: "INVALID_ID",
                    });
            }

            const { label, slug } = req.body ?? {};

            if (!isNonEmptyString(label) || !isNonEmptyString(slug)) {
                return res.status(400).json({
                    message: "'label' or 'slug' are invalid",
                    error: "INVALID_DATA",
                });
            }

            const updated = await Category.findByIdAndUpdate(
                id,
                { $set: { label, slug } },
                { new: true },
            );

            if (!updated) {
                return res
                    .status(404)
                    .json({
                        message: "Category not found",
                        error: "CATEGORY_MISSING",
                    });
            }

            return res.status(200).json(updated);
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                message: "Internal server error",
                error: "SERVER_ERROR",
            });
        }
    }

    async changeEventStatus(req, res) {
        try {
            const statuses = ["draft", "published", "unpublished", "archived"];

            const { status } = req.body ?? {};

            if (!statuses.includes(status)) {
                return res
                    .status(400)
                    .json({
                        message: "Invalid status value",
                        error: "INVALID_STATUS",
                    });
            }

            const { id } = req.params;

            if (!isValidId(id)) {
                return res
                    .status(400)
                    .json({ message: "Invalid event id", error: "INVALID_ID" });
            }

            const event = await Event.findById(id);
            if (!event) {
                return res
                    .status(404)
                    .json({
                        message: "Event not found",
                        error: "EVENT_MISSING",
                    });
            }

            if (event.status === status) {
                return res.status(409).json({
                    message: "Sended 'event.status' is the same",
                    error: "SAME_STATUS",
                });
            }

            await Event.updateOne({ _id: id }, { $set: { status } });

            return res
                .status(200)
                .json({ message: `Status has been set on '${status}'` });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                message: "Internal server error",
                error: "SERVER_ERROR",
            });
        }
    }
}

module.exports = { controller: new EventController() };
