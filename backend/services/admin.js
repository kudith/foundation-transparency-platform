import User, { ADMIN_ROLES } from "../models/admin.js";
import { hashPassword } from "../utils/password.js";
import { AppError } from "../utils/errorHandler.js";

export const createUser = async (userData) => {
  const { name, email, password, role = ADMIN_ROLES.ADMIN } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("User with this email already exists", 400);
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  return user.toJSON();
};

export const updateUser = async (userId, updateData, requestingUser = null) => {
  const { name, email, password, role } = updateData;

  // Find user
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Check if email is being changed and already exists
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError("Email already in use", 400);
    }
    user.email = email;
  }

  // Update fields
  if (name) user.name = name;

  // Only super_admin can change roles
  if (role && role !== user.role) {
    if (!requestingUser || requestingUser.role !== ADMIN_ROLES.SUPER_ADMIN) {
      throw new AppError("Only super admin can change user roles", 403);
    }
    user.role = role;
  }

  // Hash new password if provided
  if (password) {
    user.password = await hashPassword(password);
  }

  await user.save();
  return user.toJSON();
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user.toJSON();
};

export const getAllUsers = async (query = {}) => {
  const users = await User.find(query).select("-password");
  return users;
};

export const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return { message: "User deleted successfully" };
};
