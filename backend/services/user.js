import User from "../models/user.js";
import mongoose from "mongoose";

// Helper to query by ID (handles both ObjectId and String formats)
const findByIdFlexible = async (Model, id) => {
  let doc = null;
  
  // Try as ObjectId first (for data imported with ObjectId _id)
  if (mongoose.Types.ObjectId.isValid(id)) {
    try {
      doc = await Model.collection.findOne({ _id: new mongoose.Types.ObjectId(id) });
    } catch (e) {
      // Ignore and try as string
    }
  }
  
  // If not found, try as string
  if (!doc) {
    doc = await Model.collection.findOne({ _id: id });
  }
  
  return doc;
};

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
  const user = await findByIdFlexible(User, id);
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

  // Try ObjectId first, then string
  let user = null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    try {
      user = await User.collection.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );
    } catch (e) {
      // Ignore
    }
  }
  
  if (!user) {
    user = await User.collection.findOneAndUpdate(
      { _id: id },
      { $set: updateData },
      { returnDocument: 'after' }
    );
  }

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

export const deleteUser = async (id) => {
  // Try ObjectId first, then string
  let user = null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    try {
      user = await User.collection.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
    } catch (e) {
      // Ignore
    }
  }
  
  if (!user) {
    user = await User.collection.findOneAndDelete({ _id: id });
  }

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};
