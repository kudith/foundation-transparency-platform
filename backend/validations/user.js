import Joi from "joi";

export const createUserSchema = Joi.object({
  id: Joi.string().optional(),
  name: Joi.string().min(2).max(100).required().messages({
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name must not exceed 100 characters",
    "any.required": "Name is required",
  }),
  communities: Joi.array().items(Joi.string()).default([]),
  roles: Joi.array().items(Joi.string()).default([]),
  statusPekerjaan: Joi.string()
    .valid("Pelajar", "Mahasiswa", "Pekerja", "Wirausaha", "Lainnya")
    .optional()
    .messages({
      "any.only":
        "Status pekerjaan must be one of: Pelajar, Mahasiswa, Pekerja, Wirausaha, Lainnya",
    }),
  kategoriUsia: Joi.string()
    .valid("<18", "18-25", "26-35", "36-45", ">45")
    .optional()
    .messages({
      "any.only": "Kategori usia must be one of: <18, 18-25, 26-35, 36-45, >45",
    }),
  domisili: Joi.string().optional(),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  communities: Joi.array().items(Joi.string()).optional(),
  roles: Joi.array().items(Joi.string()).optional(),
  statusPekerjaan: Joi.string()
    .valid("Pelajar", "Mahasiswa", "Pekerja", "Wirausaha", "Lainnya")
    .optional(),
  kategoriUsia: Joi.string()
    .valid("<18", "18-25", "26-35", "36-45", ">45")
    .optional(),
  domisili: Joi.string().optional(),
}).min(1);
