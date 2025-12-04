import * as userService from "../services/admin.js";
import { createUserSchema, updateUserSchema } from "../validations/admin.js";
import { handleError, AppError } from "../utils/errorHandler.js";

export const create = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = createUserSchema.validate(req.body);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const user = await userService.createUser(value);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    handleError(error, req, res);
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate request body
    const { error, value } = updateUserSchema.validate(req.body);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    // Pass requesting user for role-based permission check
    const user = await userService.updateUser(id, value, req.user);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    handleError(error, req, res);
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    handleError(error, req, res);
  }
};

export const getAll = async (req, res) => {
  try {
    const users = await userService.getAllUsers();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    handleError(error, req, res);
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userService.deleteUser(id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    handleError(error, req, res);
  }
};
