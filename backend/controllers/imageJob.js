import * as imageJobService from "../services/imageJob.js";

export const getImageJobById = async (req, res, next) => {
  try {
    const imageJob = await imageJobService.getImageJobById(req.params.id);
    res.json({ success: true, data: imageJob });
  } catch (error) {
    next(error);
  }
};

export const getImageJobsByEntity = async (req, res, next) => {
  try {
    const { entityType, entityId } = req.query;
    
    if (!entityType || !entityId) {
      return res.status(400).json({
        success: false,
        message: "entityType and entityId are required",
      });
    }

    const imageJobs = await imageJobService.getImageJobsByEntity(
      entityType,
      entityId
    );
    res.json({ success: true, data: imageJobs });
  } catch (error) {
    next(error);
  }
};

/**
 * Webhook/callback endpoint for worker to update job status
 */
export const updateImageJobStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate required fields
    if (!updateData.status) {
      return res.status(400).json({
        success: false,
        message: "status is required",
      });
    }

    const imageJob = await imageJobService.updateImageJobStatus(id, updateData);
    res.json({ success: true, data: imageJob });
  } catch (error) {
    next(error);
  }
};

export const retryImageJob = async (req, res, next) => {
  try {
    const imageJob = await imageJobService.retryImageJob(req.params.id);
    res.json({ success: true, data: imageJob });
  } catch (error) {
    next(error);
  }
};

export const deleteImageJob = async (req, res, next) => {
  try {
    const imageJob = await imageJobService.deleteImageJob(req.params.id);
    res.json({ success: true, message: "Image job deleted successfully" });
  } catch (error) {
    next(error);
  }
};







