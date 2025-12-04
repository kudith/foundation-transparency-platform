import Milestone, { MILESTONE_TYPES } from "../models/milestone.js";
import mongoose from "mongoose";
import { AppError } from "../utils/errorHandler.js";
import { v4 as uuidv4 } from "uuid";

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

/**
 * Get all milestones with optional filters
 */
export const getAllMilestones = async (filters = {}) => {
  const query = {};

  if (filters.userID) {
    // Try both ObjectId and String for userID filter
    if (mongoose.Types.ObjectId.isValid(filters.userID)) {
      query.$or = [
        { userID: filters.userID },
        { userID: new mongoose.Types.ObjectId(filters.userID) }
      ];
    } else {
      query.userID = filters.userID;
    }
  }

  if (filters.type) {
    query.type = filters.type;
  }

  return await Milestone.collection.find(query).sort({ date: -1 }).toArray();
};

/**
 * Get milestone by ID
 */
export const getMilestoneById = async (id) => {
  const milestone = await findByIdFlexible(Milestone, id);
  if (!milestone) {
    throw new AppError("Milestone not found", 404);
  }
  return milestone;
};

/**
 * Get milestones by user ID
 */
export const getMilestonesByUserId = async (userID) => {
  // Query using both ObjectId and String for userID
  let query = { userID: userID };
  
  if (mongoose.Types.ObjectId.isValid(userID)) {
    query = {
      $or: [
        { userID: userID },
        { userID: new mongoose.Types.ObjectId(userID) }
      ]
    };
  }
  
  const milestones = await Milestone.collection.find(query).sort({ date: -1 }).toArray();
  return milestones;
};

/**
 * Validate detail based on type
 */
const validateDetail = (type, detail) => {
  switch (type) {
    case MILESTONE_TYPES.PROJECT_SUBMITTED:
      if (!detail.title) {
        throw new AppError("Title is required for project_submitted milestone", 400);
      }
      return { title: detail.title };
      
    case MILESTONE_TYPES.LEVEL_UP:
      if (!detail.from || !detail.to) {
        throw new AppError("From and To are required for level_up milestone", 400);
      }
      return { from: detail.from, to: detail.to };
      
    case MILESTONE_TYPES.JOB_PLACEMENT:
      if (!detail.company || !detail.role) {
        throw new AppError("Company and Role are required for job_placement milestone", 400);
      }
      return { company: detail.company, role: detail.role };
      
    default:
      throw new AppError("Invalid milestone type. Must be: project_submitted, level_up, or job_placement", 400);
  }
};

/**
 * Create new milestone
 */
export const createMilestone = async (milestoneData) => {
  const { _id, userID, type, detail, date } = milestoneData;

  // Validate type
  if (!Object.values(MILESTONE_TYPES).includes(type)) {
    throw new AppError("Invalid milestone type. Must be: project_submitted, level_up, or job_placement", 400);
  }

  // Validate and clean detail based on type
  const cleanedDetail = validateDetail(type, detail);

  // Generate ID if not provided
  const milestoneId = _id || uuidv4();

  // Check if milestone with this ID already exists
  const existingMilestone = await findByIdFlexible(Milestone, milestoneId);
  if (existingMilestone) {
    throw new AppError("Milestone with this ID already exists", 400);
  }

  const milestone = new Milestone({
    _id: milestoneId,
    userID,
    type,
    detail: cleanedDetail,
    date: new Date(date),
  });

  await milestone.save();
  return milestone;
};

/**
 * Update milestone
 */
export const updateMilestone = async (id, updateData) => {
  const milestone = await findByIdFlexible(Milestone, id);
  if (!milestone) {
    throw new AppError("Milestone not found", 404);
  }

  const updateFields = {};

  // Update fields if provided
  if (updateData.userID) {
    updateFields.userID = updateData.userID;
  }

  if (updateData.type) {
    // Validate type
    if (!Object.values(MILESTONE_TYPES).includes(updateData.type)) {
      throw new AppError("Invalid milestone type. Must be: project_submitted, level_up, or job_placement", 400);
    }
    updateFields.type = updateData.type;
  }

  if (updateData.detail) {
    // Use the new type if provided, otherwise use existing type
    const typeToValidate = updateData.type || milestone.type;
    const cleanedDetail = validateDetail(typeToValidate, updateData.detail);
    updateFields.detail = cleanedDetail;
  }

  if (updateData.date) {
    updateFields.date = new Date(updateData.date);
  }

  // Try ObjectId first, then string
  let result = null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    try {
      result = await Milestone.collection.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        { $set: updateFields },
        { returnDocument: 'after' }
      );
    } catch (e) {
      // Ignore
    }
  }
  
  if (!result) {
    result = await Milestone.collection.findOneAndUpdate(
      { _id: id },
      { $set: updateFields },
      { returnDocument: 'after' }
    );
  }

  return result;
};

/**
 * Delete milestone
 */
export const deleteMilestone = async (id) => {
  // Try ObjectId first, then string
  let milestone = null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    try {
      milestone = await Milestone.collection.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
    } catch (e) {
      // Ignore
    }
  }
  
  if (!milestone) {
    milestone = await Milestone.collection.findOneAndDelete({ _id: id });
  }

  if (!milestone) {
    throw new AppError("Milestone not found", 404);
  }
  return { message: "Milestone deleted successfully" };
};

/**
 * Get milestone statistics
 */
export const getMilestoneStats = async () => {
  const byType = await Milestone.aggregate([
    {
      $group: {
        _id: "$type",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  const byUser = await Milestone.aggregate([
    {
      $group: {
        _id: "$userID",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  const total = await Milestone.countDocuments();

  return {
    total,
    byType,
    topUsers: byUser,
  };
};

// Export milestone types for use in other modules
export { MILESTONE_TYPES };
