import Joi from "joi";

const attendeeSchema = Joi.object({
  type: Joi.string().valid("Member", "Guest").required().messages({
    "any.only": "Attendee type must be either Member or Guest",
    "any.required": "Attendee type is required",
  }),
  userID: Joi.string()
    .when("type", {
      is: "Member",
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    })
    .messages({
      "any.required": "userID is required for Member type",
      "any.unknown": "userID should not be provided for Guest type",
    }),
  name: Joi.string()
    .when("type", {
      is: "Guest",
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      "any.required": "Name is required for Guest type",
    }),
});

export const createAttendanceSchema = Joi.object({
  eventID: Joi.string().required().messages({
    "any.required": "Event ID is required",
  }),
  attendee: attendeeSchema.required().messages({
    "any.required": "Attendee information is required",
  }),
});

export const updateAttendanceSchema = Joi.object({
  eventID: Joi.string().optional(),
  attendee: attendeeSchema.optional(),
}).min(1);
