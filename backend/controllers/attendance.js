import * as attendanceService from "../services/attendance.js";

export const getAllAttendances = async (req, res, next) => {
  try {
    const attendances = await attendanceService.getAllAttendances(req.query);
    res.json({ success: true, data: attendances });
  } catch (error) {
    next(error);
  }
};

export const getAttendanceById = async (req, res, next) => {
  try {
    const attendance = await attendanceService.getAttendanceById(req.params.id);
    res.json({ success: true, data: attendance });
  } catch (error) {
    next(error);
  }
};

export const getAttendancesByEventId = async (req, res, next) => {
  try {
    const attendances = await attendanceService.getAttendancesByEventId(
      req.params.eventId
    );
    res.json({ success: true, data: attendances });
  } catch (error) {
    next(error);
  }
};

export const createAttendance = async (req, res, next) => {
  try {
    const attendance = await attendanceService.createAttendance(req.body);
    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    next(error);
  }
};

export const updateAttendance = async (req, res, next) => {
  try {
    const attendance = await attendanceService.updateAttendance(
      req.params.id,
      req.body
    );
    res.json({ success: true, data: attendance });
  } catch (error) {
    next(error);
  }
};

export const deleteAttendance = async (req, res, next) => {
  try {
    await attendanceService.deleteAttendance(req.params.id);
    res.json({ success: true, message: "Attendance deleted successfully" });
  } catch (error) {
    next(error);
  }
};
