const { Schema, model } = require("mongoose");

// ---- Utils -----------------------------

const IMAGE_URL_RE = /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i;
const URL_RE = /^https?:\/\/.+/i;

const translite = (str) => {
	const map = {
		а: "a",
		б: "b",
		в: "v",
		г: "g",
		д: "d",
		е: "e",
		ё: "e",
		ж: "zh",
		з: "z",
		и: "i",
		й: "y",
		к: "k",
		л: "l",
		м: "m",
		н: "n",
		о: "o",
		п: "p",
		р: "r",
		с: "s",
		т: "t",
		у: "u",
		ф: "f",
		х: "h",
		ц: "ts",
		ч: "ch",
		ш: "sh",
		щ: "sch",
		ь: "",
		ы: "y",
		ъ: "",
		э: "e",
		ю: "yu",
		я: "ya",
	};

	return str
		.split("")
		.map((c) => map[c] ?? c)
		.join("");
};

// ---- Schema ----------------------------

const CategorySchema = new Schema(
	{
		slug: { type: String, required: true, unique: true },
		label: { type: String, required: true },
	},
	{
		timestamps: true,
	},
);

const EventSchema = new Schema(
	{
		title: {
			type: String,
			required: [true, "Event title is required"],
			trim: true,
			maxlength: [200, "Title cannot exceed 200 characters"],
		},

		description: {
			type: String,
			required: [true, "Event description is required"],
			trim: true,
			maxlength: [5000, "Description cannot exceed 5000 characters"],
		},

		category: {
			type: Schema.Types.ObjectId,
			ref: "Category",
			required: true,
			index: true,
		},

		media: {
			cover: {
				type: String,
				required: [true, "Cover images is required"],
				trim: true,
				// validate: {
				// 	validator: (v) => IMAGE_URL_RE.test(v),
				// 	message: "Invalid image URL format",
				// },
			},
			gallery: {
				type: [String],
				default: [],
				// validate: {
				// 	validator: (arr) => arr.every((url) => IMAGE_URL_RE.test(url)),
				// 	message: "All gallery URLs mest be valid image URLs",
				// },
			},
		},

		// Цена
		pricing: {
			amount: {
				type: Number,
				required: true,
				min: [0, "Price cannot be negative"],
				max: [100000, "Price cannot exceed 100000"],
				default: 0,
			},
			isFree: {
				type: Boolean,
				default: false,
			},
		},

		// Букинг
		// "ticket" - покупка по внешней ссылке
		// "request" - заявка через форму (только разовое, локация по договоренности)
		booking: {
			type: {
				type: String,
				enum: {
					values: ["ticket", "request"],
					message: "{VALUE} is not a valid booking type",
				},
				required: [true, "Booking type is required"],
			},
			ticketUrl: {
				type: String,
				trim: true,
				validate: {
					validator: (v) => !v || URL_RE.test(v),
					message: "Invalid ticket URL",
				},
			},
			maxParticipants: {
				type: Number,
				min: [1, "maxParticipants must be at least 1"],
			},
		},

		// Расписание
		// isSubscription: false - разовое мероприятие, строго одна дата
		// isSubscription: true - абонемент, несколько фиксированных дат, доступ только при booking.type === "ticket"

		schedule: {
			isSubscription: {
				type: Boolean,
				default: false,
			},
			dates: {
				type: [Date],
				default: [],
				// required: [true, "At least one scheduled date is required"],
				// validate: {
				//   validator: (dates) => dates?.length > 0,
				//   message: "At least one date must be specified",
				// },
			},
		},

		// Ограничения
		restrictions: {
			ageMin: {
				type: Number,
				min: [0, "Minimum age cannot be negative"],
				max: [100, "Invalid minimum age"],
				default: 0,
			},
			ageMax: {
				type: Number,
				min: [0, "Maximum age cannot be negative"],
				max: [100, "Invalid Maximum age"],
				default: 100,
			},
			requiresAdult: {
				type: Boolean,
				default: false,
			},
		},

		// Длительность
		duration: {
			minutes: {
				type: Number,
				required: [true, "Duration is required"],
				min: [15, "Duration must be at least 15 minutes"],
				max: [1440, "Duration cannot exceed 24 hours"],
			},
			isApproximate: {
				type: Boolean,
				default: false,
			},
		},

		// Организатор
		organizer: {
			name: {
				type: String,
				trim: true,
				default: "",
			},
			email: {
				type: String,
				trim: true,
				lowercase: true,
				default: "",
			},
			phone: {
				type: String,
				trim: true,
				default: "",
			},
		},

		// Статусы мероприятия - текущий статус видно только админу
		status: {
			type: String,
			enum: {
				values: ["published", "unpublished", "archived"],
				message: "{VALUE} is not a valid status",
			},
			default: "unpublished",
			index: true,
		},

		// Условия отмены события
		cancellationPolicy: {
			type: String,
			trim: true,
			default: '',
		},

		seo: {
			metaTitle: String,
			metaDescription: String,
			slug: {
				type: String,
				unique: true,
				sparse: true,
				lowercase: true,
				trim: true,
			},
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

// ------ Индексы --------------------

EventSchema.index({ category: 1, status: 1, "schedule.dates": 1 });
EventSchema.index({ status: 1, "schedule.dates": 1 });
EventSchema.index({ title: "text", description: "text" });

// ------ Виртуальные поля --------------------

EventSchema.virtual("durationFormatted").get(function () {
	const h = Math.floor(this.duration.minutes / 60);
	const m = this.duration.minutes % 60;
	if (h === 0) return `${h} ч.`;
	if (m === 0) return `${m} мин.`;
	return `${h} ч. ${m} мин.`;
});

EventSchema.virtual("ageRange").get(function () {
	const { ageMin, ageMax } = this.restrictions;

	return ageMax ? `${ageMin}-${ageMax}` : `${ageMin}+`;
});

// ------ Middleware --------------------

EventSchema.pre("save", async function () {
	if (this.schedule.isSubscription && this.booking.type !== "ticket") {
		throw new Error("Subscription is only available with ticket booking");
	}

	if (this.schedule.isSubscription && this.schedule.dates.length < 2) {
		throw new Error("Subscription must have at least 2 dates");
	}

	if (this.booking.type === "ticket" && !this.booking.ticketUrl) {
		throw new Error("ticketUrl is required for ticket booking");
	}

	const { ageMin, ageMax } = this.restrictions;
	if (ageMax && ageMin > ageMax) {
		throw new Error("ageMin cannot be greater than ageMax");
	}

	if (this.schedule.dates?.length) {
		this.schedule.dates.sort((a, b) => new Date(a) - new Date(b));
	}

	this.pricing.isFree = this.pricing.amount === 0;

	if (!this.seo.slug && this.title) {
		this.seo.slug = translite(this.title.toLowerCase())
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "");
	}
});


// Статические методы

EventSchema.statics.findSubscriptions = function () {
	return this.find({
		"schedule.isSubscription": true,
		status: "published",
	});
};

EventSchema.statics.findNotSubscriptions = function () {
	return this.find({
		"schedule.isSubscription": false,
		status: "published",
	});
};

EventSchema.statics.findUpcoming = function (limit = 10) {
	return this.find({
		status: "published",
		"schedule.dates": { $gte: new Date() },
	}).limit(limit);
};

EventSchema.statics.findByCategory = async function (slug, limit = 10) {
	const cat = await Category.findOne({ slug });
	if (!cat) return [];

	return this.find({
		category: cat._id,
		status: "published",
	})
		.populate("category", "slug label")
		.limit(limit);
};

module.exports = {
	Event: model("Event", EventSchema),
	Category: model("Category", CategorySchema),
};
