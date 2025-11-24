import Attendance from "../models/attendances.js";
import Event from "../models/event.js";
import User from "../models/user.js";
import mongoose from "mongoose";

export const getAllAttendances = async (filters = {}) => {
  const query = {};

  if (filters.eventID) {
    // Convert string to ObjectId if needed
    query.eventID = mongoose.Types.ObjectId.isValid(filters.eventID) 
      ? new mongoose.Types.ObjectId(filters.eventID)
      : filters.eventID;
  }

  if (filters.type) {
    query["attendee.type"] = filters.type;
  }

  if (filters.userID) {
    query["attendee.userID"] = mongoose.Types.ObjectId.isValid(filters.userID)
      ? new mongoose.Types.ObjectId(filters.userID)
      : filters.userID;
  }

  return await Attendance.find(query)
    .populate("eventID")
    .populate("attendee.userID");
};

export const getAttendanceById = async (id) => {
  const attendance = await Attendance.findById(id)
    .populate("eventID")
    .populate("attendee.userID");
  if (!attendance) {
    const error = new Error("Attendance not found");
    error.statusCode = 404;
    throw error;
  }
  return attendance;
};

export const getAttendancesByEventId = async (eventID) => {
  const objectId = mongoose.Types.ObjectId.isValid(eventID)
    ? new mongoose.Types.ObjectId(eventID)
    : eventID;
  return await Attendance.find({ eventID: objectId })
    .populate("eventID")
    .populate("attendee.userID");
};

export const createAttendance = async (attendanceData) => {
  // Validate and convert eventID to ObjectId
  if (!mongoose.Types.ObjectId.isValid(attendanceData.eventID)) {
    const error = new Error("Invalid event ID format");
    error.statusCode = 400;
    throw error;
  }

  const eventObjectId = new mongoose.Types.ObjectId(attendanceData.eventID);

  // Cek event
  const event = await Event.findById(eventObjectId);
  if (!event) {
    const error = new Error("Event not found");
    error.statusCode = 404;
    throw error;
  }

  let attendeeName = attendanceData.attendee.name;
  const attendeeType = attendanceData.attendee.type;
  let attendeeUserID = attendanceData.attendee.userID;

  if (attendeeType === "Member") {
    // userID wajib, name tidak boleh manual
    if (!attendeeUserID) {
      const error = new Error("userID is required for Member type");
      error.statusCode = 400;
      throw error;
    }

    // Validate and convert userID to ObjectId
    if (!mongoose.Types.ObjectId.isValid(attendeeUserID)) {
      const error = new Error("Invalid user ID format");
      error.statusCode = 400;
      throw error;
    }

    attendeeUserID = new mongoose.Types.ObjectId(attendeeUserID);

    const user = await User.findById(attendeeUserID);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    attendeeName = user.name;
  } else if (attendeeType === "Guest") {
    // name wajib, userID harus kosong
    if (!attendeeName) {
      const error = new Error("Guest name is required");
      error.statusCode = 400;
      throw error;
    }
    if (attendeeUserID) {
      const error = new Error("userID should not be provided for Guest type");
      error.statusCode = 400;
      throw error;
    }
    attendeeUserID = null; // Explicitly set to null for guests
  } else {
    const error = new Error("Invalid attendee type");
    error.statusCode = 400;
    throw error;
  }

  const attendance = new Attendance({
    eventID: eventObjectId,
    attendee: {
      type: attendeeType,
      userID: attendeeUserID,
      name: attendeeName,
    },
  });

  return await attendance.save();
};

export const updateAttendance = async (id, attendanceData) => {
  const attendeeType = attendanceData.attendee.type;
  let attendeeUserID = attendanceData.attendee.userID;
  let attendeeName = attendanceData.attendee.name;

  if (attendeeType === "Member") {
    if (!attendeeUserID) {
      const error = new Error("userID is required for Member type");
      error.statusCode = 400;
      throw error;
    }

    // Validate and convert userID to ObjectId
    if (!mongoose.Types.ObjectId.isValid(attendeeUserID)) {
      const error = new Error("Invalid user ID format");
      error.statusCode = 400;
      throw error;
    }

    attendeeUserID = new mongoose.Types.ObjectId(attendeeUserID);

    const user = await User.findById(attendeeUserID);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    attendeeName = user.name;
  } else if (attendeeType === "Guest") {
    if (!attendeeName) {
      const error = new Error("Guest name is required");
      error.statusCode = 400;
      throw error;
    }
    if (attendeeUserID) {
      const error = new Error("userID should not be provided for Guest type");
      error.statusCode = 400;
      throw error;
    }
    attendeeUserID = null;
  } else {
    const error = new Error("Invalid attendee type");
    error.statusCode = 400;
    throw error;
  }

  // Validate and convert eventID to ObjectId if provided
  let eventObjectId = attendanceData.eventID;
  if (eventObjectId) {
    if (!mongoose.Types.ObjectId.isValid(eventObjectId)) {
      const error = new Error("Invalid event ID format");
      error.statusCode = 400;
      throw error;
    }
    eventObjectId = new mongoose.Types.ObjectId(eventObjectId);
  }

  const updateData = {
    ...(eventObjectId && { eventID: eventObjectId }),
    attendee: {
      type: attendeeType,
      userID: attendeeUserID,
      name: attendeeName,
    },
  };

  const attendance = await Attendance.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!attendance) {
    const error = new Error("Attendance not found");
    error.statusCode = 404;
    throw error;
  }

  return attendance;
};

export const deleteAttendance = async (id) => {
  const attendance = await Attendance.findByIdAndDelete(id);

  if (!attendance) {
    const error = new Error("Attendance not found");
    error.statusCode = 404;
    throw error;
  }

  return attendance;
};
