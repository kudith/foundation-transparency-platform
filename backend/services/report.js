import Report from "../models/report.js";
import mongoose from "mongoose";
import { getRedisClient } from "../config/redis.js";

// Helper function to validate and format date string
const validateAndFormatDate = (dateString) => {
  if (!dateString) return null;

  // Try to parse the date
  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${dateString}`);
  }

  // Return ISO 8601 string
  return date.toISOString();
};

export const getAllReports = async (filters = {}) => {
  const query = {};

  if (filters.type) {
    query.type = filters.type;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.startDate && filters.endDate) {
    query.createdAt = {
      $gte: new Date(filters.startDate),
      $lte: new Date(filters.endDate),
    };
  }

  return await Report.find(query).sort({ createdAt: -1 });
};

export const getReportById = async (id) => {
  const report = await Report.findById(id);
  if (!report) {
    const error = new Error("Report not found");
    error.statusCode = 404;
    throw error;
  }
  return report;
};

export const createReport = async (reportData) => {
  const validTypes = [
    "financial_summary",
    "program_impact",
    "participant_demographics",
    "community_activity",
  ];

  if (!validTypes.includes(reportData.type)) {
    const error = new Error("Invalid report type");
    error.statusCode = 400;
    throw error;
  }

  let filters = {};

  // Validate and format dates
  const startDate = validateAndFormatDate(reportData.filters?.start_date);
  const endDate = validateAndFormatDate(reportData.filters?.end_date);

  if (reportData.type === "community_activity") {
    if (!reportData.filters?.community_name) {
      const error = new Error(
        "community_name is required for community_activity report"
      );
      error.statusCode = 400;
      throw error;
    }
    filters = {
      community_name: reportData.filters.community_name,
      start_date: startDate,
      end_date: endDate,
    };
  } else if (reportData.type === "participant_demographics") {
    if (!reportData.filters?.community_name || typeof reportData.filters.community_name !== "string") {
      const error = new Error(
        "community_name is required and must be a string for participant_demographics report"
      );
      error.statusCode = 400;
      throw error;
    }
    filters = {
      community_name: reportData.filters.community_name,
      start_date: startDate,
      end_date: endDate,
    };
  } else if (reportData.type === "program_impact") {
    if (!reportData.filters?.community_name || typeof reportData.filters.community_name !== "string") {
      const error = new Error(
        "community_name is required and must be a string for program_impact report"
      );
      error.statusCode = 400;
      throw error;
    }
    filters = {
      community_name: reportData.filters.community_name,
      start_date: startDate,
      end_date: endDate,
    };
  } else if (reportData.type === "financial_summary") {
    filters = {
      start_date: startDate,
      end_date: endDate,
    };
  }

  const report = new Report({
    type: reportData.type,
    status: "pending",
    filters,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return await report.save();
};

export const updateReport = async (id, reportData) => {
  const updateData = {
    updatedAt: new Date(),
  };

  if (reportData.status) {
    const validStatuses = ["pending", "processing", "completed", "failed"];
    if (!validStatuses.includes(reportData.status)) {
      const error = new Error("Invalid status");
      error.statusCode = 400;
      throw error;
    }
    updateData.status = reportData.status;
  }

  if (reportData.fileURL !== undefined) {
    updateData.fileURL = reportData.fileURL;
  }

  if (reportData.errorMsg !== undefined) {
    updateData.errorMsg = reportData.errorMsg;
  }

  if (reportData.filters) {
    // Validate dates if they exist
    if (reportData.filters.start_date) {
      reportData.filters.start_date = validateAndFormatDate(
        reportData.filters.start_date
      );
    }
    if (reportData.filters.end_date) {
      reportData.filters.end_date = validateAndFormatDate(
        reportData.filters.end_date
      );
    }
    updateData.filters = reportData.filters;
  }

  const report = await Report.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!report) {
    const error = new Error("Report not found");
    error.statusCode = 404;
    throw error;
  }

  return report;
};

export const deleteReport = async (id) => {
  const report = await Report.findByIdAndDelete(id);

  if (!report) {
    const error = new Error("Report not found");
    error.statusCode = 404;
    throw error;
  }

  return report;
};

export const getReportStats = async () => {
  const stats = await Report.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const byType = await Report.aggregate([
    {
      $group: {
        _id: "$type",
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    byStatus: stats,
    byType: byType,
  };
};

// TAMBAHKAN FUNGSI INI
export const enqueueReportJob = async (reportId) => {
  if (!mongoose.Types.ObjectId.isValid(reportId)) {
    const error = new Error("Invalid report ID format");
    error.statusCode = 400;
    throw error;
  }

  const report = await Report.findById(reportId);
  if (!report) {
    const error = new Error("Report not found");
    error.statusCode = 404;
    throw error;
  }

  if (report.status !== "pending") {
    const error = new Error(
      `Report status is ${report.status}, cannot enqueue`
    );
    error.statusCode = 400;
    throw error;
  }

  // Ensure dates are in correct format before enqueueing
  const filters = { ...report.filters };
  if (filters.start_date && typeof filters.start_date !== "string") {
    filters.start_date = new Date(filters.start_date).toISOString();
  }
  if (filters.end_date && typeof filters.end_date !== "string") {
    filters.end_date = new Date(filters.end_date).toISOString();
  }

  // Ensure community_name is a valid string for report types that require it
  if (report.type === "community_activity" || report.type === "program_impact" || report.type === "participant_demographics") {
    if (!filters.community_name || typeof filters.community_name !== "string") {
      const error = new Error(
        `community_name is required and must be a string for ${report.type} report`
      );
      error.statusCode = 400;
      throw error;
    }
  } else {
    // Remove community_name from filters for report types that don't need it
    delete filters.community_name;
  }

  const payload = {
    task_type: "generate_report",
    payload: {
      reportID: report._id.toString(),
      reportType: report.type,
      filters: filters,
    },
  };

  const redisClient = getRedisClient();
  await redisClient.lPush("task_queue", JSON.stringify(payload));

  report.status = "processing";
  await report.save();

  return report;
};
