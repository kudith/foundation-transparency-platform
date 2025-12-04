import Joi from "joi";

// Valid admin roles
const validRoles = ["admin", "super_admin"];

export const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name must not exceed 100 characters",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
  role: Joi.string()
    .valid(...validRoles)
    .default("admin")
    .messages({
      "any.only": "Role must be either admin or super_admin",
    }),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
  role: Joi.string()
    .valid(...validRoles)
    .optional()
    .messages({
      "any.only": "Role must be either admin or super_admin",
    }),
}).min(1);
