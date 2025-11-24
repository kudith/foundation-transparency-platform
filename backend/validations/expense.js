import Joi from "joi";

export const createExpenseSchema = Joi.object({
  category: Joi.string().min(2).required().messages({
    "string.min": "Category must be at least 2 characters",
    "any.required": "Category is required",
  }),
  amount: Joi.number().positive().required().messages({
    "number.positive": "Amount must be greater than 0",
    "any.required": "Amount is required",
  }),
  description: Joi.string().allow("").default(""),
  date: Joi.date().required().messages({
    "any.required": "Date is required",
    "date.base": "Invalid date format",
  }),
});

export const updateExpenseSchema = Joi.object({
  category: Joi.string().min(2).optional(),
  amount: Joi.number().positive().optional().messages({
    "number.positive": "Amount must be greater than 0",
  }),
  description: Joi.string().allow("").optional(),
  date: Joi.date().optional(),
}).min(1);
