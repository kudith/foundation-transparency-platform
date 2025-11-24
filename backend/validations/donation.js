import Joi from "joi";

const cashDetailsSchema = Joi.object({
  amount: Joi.number().positive().required().messages({
    "number.positive": "Amount must be a positive number",
    "any.required": "Amount is required for Cash donation",
  }),
});

const inKindDetailsSchema = Joi.object({
  estimatedValue: Joi.number().positive().required().messages({
    "number.positive": "Estimated value must be a positive number",
    "any.required": "Estimated value is required for InKind donation",
  }),
  description: Joi.string().min(3).required().messages({
    "string.min": "Description must be at least 3 characters",
    "any.required": "Description is required for InKind donation",
  }),
  category: Joi.string().required().messages({
    "any.required": "Category is required for InKind donation",
  }),
});

export const createDonationSchema = Joi.object({
  donationType: Joi.string().valid("Cash", "InKind").required().messages({
    "any.only": "Donation type must be either Cash or InKind",
    "any.required": "Donation type is required",
  }),
  source: Joi.string().required().messages({
    "any.required": "Source is required",
  }),
  program: Joi.string().required().messages({
    "any.required": "Program is required",
  }),
  cashDetails: Joi.when("donationType", {
    is: "Cash",
    then: cashDetailsSchema.required(),
    otherwise: Joi.forbidden(),
  }).messages({
    "any.required": "Cash details are required for Cash donation",
    "any.unknown": "Cash details should not be provided for InKind donation",
  }),
  inKindDetails: Joi.when("donationType", {
    is: "InKind",
    then: inKindDetailsSchema.required(),
    otherwise: Joi.forbidden(),
  }).messages({
    "any.required": "InKind details are required for InKind donation",
    "any.unknown": "InKind details should not be provided for Cash donation",
  }),
  date: Joi.date().required().messages({
    "any.required": "Date is required",
    "date.base": "Invalid date format",
  }),
});

export const updateDonationSchema = Joi.object({
  donationType: Joi.string().valid("Cash", "InKind").optional(),
  source: Joi.string().optional(),
  program: Joi.string().optional(),
  cashDetails: Joi.when("donationType", {
    is: "Cash",
    then: cashDetailsSchema.optional(),
    otherwise: Joi.forbidden(),
  }),
  inKindDetails: Joi.when("donationType", {
    is: "InKind",
    then: inKindDetailsSchema.optional(),
    otherwise: Joi.forbidden(),
  }),
  date: Joi.date().optional(),
}).min(1);
