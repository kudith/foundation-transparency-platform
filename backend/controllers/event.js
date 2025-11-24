import * as eventService from "../services/event.js";

export const getAllEvents = async (req, res, next) => {
  try {
    const events = await eventService.getAllEvents(req.query);
    res.json({ success: true, data: events });
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req, res, next) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    res.json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    // Parse tutor if it's a string (from FormData)
    if (typeof req.body.tutor === "string") {
      try {
        req.body.tutor = JSON.parse(req.body.tutor);
      } catch (parseError) {
        return res.status(400).json({
          success: false,
          message: "Invalid tutor data format",
        });
      }
    }

    const event = await eventService.createEvent(req.body, req.files);
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    // Parse tutor if it's a string (from FormData)
    if (typeof req.body.tutor === "string") {
      try {
        req.body.tutor = JSON.parse(req.body.tutor);
      } catch (parseError) {
        return res.status(400).json({
          success: false,
          message: "Invalid tutor data format",
        });
      }
    }

    const event = await eventService.updateEvent(
      req.params.id,
      req.body,
      req.files
    );
    res.json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

export const deleteEventImage = async (req, res, next) => {
  try {
    const event = await eventService.deleteEventImage(
      req.params.id,
      req.params.publicId
    );
    res.json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    await eventService.deleteEvent(req.params.id);
    res.json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    next(error);
  }
};
