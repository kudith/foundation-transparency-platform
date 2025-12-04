import Joi from "joi";

// Valid milestone types
const validTypes = ["project_submitted", "level_up", "job_placement"];

// Detail schema for project_submitted
const projectSubmittedDetailSchema = Joi.object({
  title: Joi.string().min(1).max(200).required().messages({
    "string.min": "Title must be at least 1 character",
    "string.max": "Title must not exceed 200 characters",
    "any.required": "Title is required for project_submitted milestone",
  }),
});

// Detail schema for level_up
const levelUpDetailSchema = Joi.object({
  from: Joi.string().min(1).max(50).required().messages({
    "string.min": "From must be at least 1 character",
    "string.max": "From must not exceed 50 characters",
    "any.required": "From is required for level_up milestone",
  }),
  to: Joi.string().min(1).max(50).required().messages({
    "string.min": "To must be at least 1 character",
    "string.max": "To must not exceed 50 characters",
    "any.required": "To is required for level_up milestone",
  }),
});

// Detail schema for job_placement
const jobPlacementDetailSchema = Joi.object({
  company: Joi.string().min(1).max(200).required().messages({
    "string.min": "Company must be at least 1 character",
    "string.max": "Company must not exceed 200 characters",
    "any.required": "Company is required for job_placement milestone",
  }),
  role: Joi.string().min(1).max(100).required().messages({
    "string.min": "Role must be at least 1 character",
    "string.max": "Role must not exceed 100 characters",
    "any.required": "Role is required for job_placement milestone",
  }),
});

export const createMilestoneSchema = Joi.object({
  _id: Joi.string().optional().messages({
    "string.base": "ID must be a string",
  }),
  userID: Joi.string().required().messages({
    "any.required": "User ID is required",
  }),
  type: Joi.string()
    .valid(...validTypes)
    .required()
    .messages({
      "any.only": "Type must be one of: project_submitted, level_up, job_placement",
      "any.required": "Milestone type is required",
    }),
  detail: Joi.when("type", {
    switch: [
      {
        is: "project_submitted",
        then: projectSubmittedDetailSchema.required(),
      },
      {
        is: "level_up",
        then: levelUpDetailSchema.required(),
      },
      {
        is: "job_placement",
        then: jobPlacementDetailSchema.required(),
      },
    ],
    otherwise: Joi.object().required(),
  }),
  date: Joi.date().required().messages({
    "any.required": "Date is required",
    "date.base": "Invalid date format",
  }),
});

export const updateMilestoneSchema = Joi.object({
  userID: Joi.string().optional(),
  type: Joi.string()
    .valid(...validTypes)
    .optional()
    .messages({
      "any.only": "Type must be one of: project_submitted, level_up, job_placement",
    }),
  detail: Joi.when("type", {
    switch: [
      {
        is: "project_submitted",
        then: projectSubmittedDetailSchema.optional(),
      },
      {
        is: "level_up",
        then: levelUpDetailSchema.optional(),
      },
      {
        is: "job_placement",
        then: jobPlacementDetailSchema.optional(),
      },
    ],
    otherwise: Joi.object().optional(),
  }),
  date: Joi.date().optional().messages({
    "date.base": "Invalid date format",
  }),
}).min(1);
