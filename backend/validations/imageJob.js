import Joi from "joi";

export const updateImageJobStatusSchema = Joi.object({
  status: Joi.string()
    .valid("PENDING", "PROCESSING", "COMPLETED", "FAILED") // UPPERCASE
    .required()
    .messages({
      "any.required": "Status is required",
      "any.only": "Status must be one of: PENDING, PROCESSING, COMPLETED, FAILED",
    }),
  outputImageURL: Joi.string().optional().allow("").messages({
    "string.uri": "Output image URL must be a valid URL",
  }),
  outputImageKey: Joi.string().optional().allow(""),
  errorMsg: Joi.string().optional().allow(""),
});

export const getImageJobsByEntitySchema = Joi.object({
  entityType: Joi.string()
    .valid("event", "report", "other")
    .required()
    .messages({
      "any.required": "Entity type is required",
      "any.only": "Entity type must be one of: event, report, other",
    }),
  entityId: Joi.string().required().messages({
    "any.required": "Entity ID is required",
  }),
});

