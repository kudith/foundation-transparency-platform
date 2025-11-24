import * as reportService from "../services/report.js";

export const getAllReports = async (req, res, next) => {
  try {
    const reports = await reportService.getAllReports(req.query);
    res.json({ success: true, data: reports });
  } catch (error) {
    next(error);
  }
};

export const getReportById = async (req, res, next) => {
  try {
    const report = await reportService.getReportById(req.params.id);
    res.json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

export const createReport = async (req, res, next) => {
  try {
    const report = await reportService.createReport(req.body);
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

export const updateReport = async (req, res, next) => {
  try {
    const report = await reportService.updateReport(req.params.id, req.body);
    res.json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

export const deleteReport = async (req, res, next) => {
  try {
    await reportService.deleteReport(req.params.id);
    res.json({ success: true, message: "Report deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getReportStats = async (req, res, next) => {
  try {
    const stats = await reportService.getReportStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

export const enqueueReportJob = async (req, res, next) => {
  try {
    const report = await reportService.enqueueReportJob(req.params.id);
    res.json({
      success: true,
      message: "Report job enqueued successfully",
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

// Optional: Create and enqueue in one request
export const createAndEnqueueReport = async (req, res, next) => {
  try {
    // Create report
    const report = await reportService.createReport(req.body);

    // Enqueue job
    await reportService.enqueueReportJob(report._id);

    res.status(201).json({
      success: true,
      message: "Report created and job enqueued",
      data: report,
    });
  } catch (error) {
    next(error);
  }
};
