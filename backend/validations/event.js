import Joi from "joi";

const tutorSchema = Joi.object({
  type: Joi.string().valid("Internal", "External").required().messages({
    "any.only": "Tutor type must be either Internal or External",
    "any.required": "Tutor type is required",
  }),
  userID: Joi.string().optional(),
  name: Joi.string()
    .when("type", {
      is: "External",
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      "any.required": "Name is required for External tutor",
    }),
});

export const createEventSchema = Joi.object({
  name: Joi.string().min(3).max(200).required().messages({
    "string.min": "Event name must be at least 3 characters",
    "string.max": "Event name must not exceed 200 characters",
    "any.required": "Event name is required",
  }),
  community: Joi.string().required().messages({
    "any.required": "Community is required",
  }),
  date: Joi.date().required().messages({
    "any.required": "Event date is required",
    "date.base": "Invalid date format",
  }),
  tutor: tutorSchema.required().messages({
    "any.required": "Tutor information is required",
  }),
  description: Joi.string().max(1000).optional().allow(""),
  location: Joi.string().max(200).optional().allow(""),
});

export const updateEventSchema = Joi.object({
  name: Joi.string().min(3).max(200).optional(),
  community: Joi.string().optional(),
  date: Joi.date().optional(),
  tutor: tutorSchema.optional(),
  description: Joi.string().max(1000).optional().allow(""),
  location: Joi.string().max(200).optional().allow(""),
}).min(1);
