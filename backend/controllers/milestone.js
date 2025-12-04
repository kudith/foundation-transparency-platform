import * as milestoneService from "../services/milestone.js";
import {
  createMilestoneSchema,
  updateMilestoneSchema,
} from "../validations/milestone.js";
import { handleError, AppError } from "../utils/errorHandler.js";

/**
 * Get all milestones
 */
export const getAll = async (req, res) => {
  try {
    const milestones = await milestoneService.getAllMilestones(req.query);

    res.status(200).json({
      success: true,
      data: milestones,
      count: milestones.length,
    });
  } catch (error) {
    handleError(error, req, res);
  }
};

/**
 * Get milestone by ID
 */
export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const milestone = await milestoneService.getMilestoneById(id);

    res.status(200).json({
      success: true,
      data: milestone,
    });
  } catch (error) {
    handleError(error, req, res);
  }
};

/**
 * Get milestones by user ID
 */
export const getByUserId = async (req, res) => {
  try {
    const { userID } = req.params;
    const milestones = await milestoneService.getMilestonesByUserId(userID);

    res.status(200).json({
      success: true,
      data: milestones,
      count: milestones.length,
    });
  } catch (error) {
    handleError(error, req, res);
  }
};

/**
 * Create new milestone
 */
export const create = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = createMilestoneSchema.validate(req.body);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const milestone = await milestoneService.createMilestone(value);

    res.status(201).json({
      success: true,
      message: "Milestone created successfully",
      data: milestone,
    });
  } catch (error) {
    handleError(error, req, res);
  }
};

/**
 * Update milestone
 */
export const update = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate request body
    const { error, value } = updateMilestoneSchema.validate(req.body);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const milestone = await milestoneService.updateMilestone(id, value);

    res.status(200).json({
      success: true,
      message: "Milestone updated successfully",
      data: milestone,
    });
  } catch (error) {
    handleError(error, req, res);
  }
};

/**
 * Delete milestone
 */
export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await milestoneService.deleteMilestone(id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    handleError(error, req, res);
  }
};

/**
 * Get milestone statistics
 */
export const getStats = async (req, res) => {
  try {
    const stats = await milestoneService.getMilestoneStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    handleError(error, req, res);
  }
};

