import User from "../models/user.js";
import mongoose from "mongoose";

export const getAllUsers = async (filters = {}) => {
  const query = {};

  if (filters.communities) {
    query.communities = { $in: [filters.communities] };
  }

  if (filters.roles) {
    query.roles = { $in: [filters.roles] };
  }

  if (filters.statusPekerjaan) {
    query.statusPekerjaan = filters.statusPekerjaan;
  }

  if (filters.kategoriUsia) {
    query.kategoriUsia = filters.kategoriUsia;
  }

  if (filters.domisili) {
    query.domisili = new RegExp(filters.domisili, "i");
  }

  return await User.find(query);
};

export const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return user;
};

export const createUser = async (userData) => {
  const user = new User({
    _id: userData.id || new mongoose.Types.ObjectId().toString(),
    name: userData.name,
    communities: userData.communities || [],
    roles: userData.roles || [],
    statusPekerjaan: userData.statusPekerjaan,
    kategoriUsia: userData.kategoriUsia,
    domisili: userData.domisili,
    createdAt: new Date(),
  });

  return await user.save();
};

export const updateUser = async (id, userData) => {
  const updateData = {
    communities: userData.communities,
    roles: userData.roles,
  };

  if (userData.name) updateData.name = userData.name;
  if (userData.statusPekerjaan)
    updateData.statusPekerjaan = userData.statusPekerjaan;
  if (userData.kategoriUsia) updateData.kategoriUsia = userData.kategoriUsia;
  if (userData.domisili) updateData.domisili = userData.domisili;

  const user = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

export const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};
