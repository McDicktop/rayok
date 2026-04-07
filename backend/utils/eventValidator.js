const mongoose = require("mongoose");

// Primitives

const URL_RE = /^https?:\/\/.+/i;

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
const isNonEmptyString = (v) => typeof v === "string" && v.trim().length > 0;
const isValidAge = (n, min = 0, max = 100) =>
	typeof n === "number" && Number.isInteger(n) && n >= min && n <= max;

// Field-level
const validateStringFields = (obj, keys) => {
	for (const key of keys) {
		if (typeof obj[key] !== "string") return `${key} must be a string`;
	}
	return null;
};

const validateOrganizer = (organizer) =>
	validateStringFields(organizer, ["name", "email", "phone"]);

const validateSeo = (seo) =>
	validateStringFields(seo, ["metaTitle", "metaDescription", "slug"]);

const validateRestrictions = (rest) => {
	if (rest?.ageMin === undefined || rest?.ageMax === undefined) {
		return "'ageMin' and 'ageMax' are required";
	}
	if (
		!isValidAge(rest.ageMin) ||
		!isValidAge(rest.ageMax) ||
		rest.ageMin > rest.ageMax
	) {
		return "'ageMin' and 'ageMax' are invalid";
	}
	if (typeof rest.requiresAdult !== "boolean") {
		return "'requiresAdult' must be a boolean";
	}
	return null;
};

const validatePricing = ({ amount } = {}) => {
	if (typeof amount !== "number" || amount < 0 || amount > 100000) {
		return "'pricing.amount' is required and must be between 0 and 100 000";
	}

	return null;
};

const validateDuration = ({ minutes, isApproximate } = {}) => {
	if (
		!minutes ||
		typeof minutes !== "number" ||
		minutes < 15 ||
		minutes > 1440
	) {
		return "'duration.minutes' must be number type from 15 to 1440";
	}

	if (typeof isApproximate !== "boolean") {
		return "duration.isApproximate must be boolean type";
	}

	return null;
};

const validateSchedule = (bookingType, { dates } = {}) => {
	if (!Array.isArray(dates)) return "Schedule 'dates' must be an array";

	const hasDates = dates.length > 0;

	if (hasDates && bookingType === "request") {
		return "Booking type 'request' must not have speacific dates";
	}
	if (!hasDates && bookingType === "ticket") {
		return "Booking type 'request' requires at least one date";
	}
	if (hasDates && dates.some((d) => isNaN(new Date(d).getTime()))) {
		return "One or more schedule dates are invalid";
	}

	return null;
};

const validateBooking = ({ maxParticipants, type, ticketUrl } = {}) => {
	if (
		typeof maxParticipants !== "number" ||
		!Number.isInteger(maxParticipants) ||
		maxParticipants < 1 ||
		maxParticipants > 100
	) {
		return {
			message: "'booking.maxParticipants' must be an integer between 1 and 100",
			error: "INVALID_PARTICIPANTS",
		};
	}

	if (type === "ticket") {
		if (typeof ticketUrl !== "string" || !URL_RE.test(ticketUrl)) {
			return {
				message: "'booking.ticketUrl' is missing or invalid",
				error: "INVALID_BOOKING_URL",
			};
		}
	} else if (type !== "request") {
		return {
			message: "'booking.type' must be 'request' or 'ticket'",
			error: "INVALID_BOOKING_TYPE",
		};
	}

	return null;
};



module.exports = {
	URL_RE,
	isValidId,
	isNonEmptyString,
	validateOrganizer,
	validateSeo,
	validateRestrictions,
	validatePricing,
	validateDuration,
	validateBooking,
	validateSchedule
}