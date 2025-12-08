import Event from "../models/event.js";
import User from "../models/user.js";
import mongoose from "mongoose";
import { createImageJob, getImageJobsByIds, deleteImageJob } from "./imageJob.js";

export const getAllEvents = async (filters = {}) => {
  const query = {};

  if (filters.community) {
    query.community = filters.community;
  }

  if (filters.startDate && filters.endDate) {
    query.date = {
      $gte: new Date(filters.startDate),
      $lte: new Date(filters.endDate),
    };
  }

  const events = await Event.find(query).sort({ date: -1 });
  
  // Populate images from image jobs (keep parity with detail view and allow fallback to raw URL)
  const eventsWithImages = await Promise.all(
    events.map(async (event) => {
      const eventObj = event.toObject();
      if (eventObj.imageJobIds && eventObj.imageJobIds.length > 0) {
        const imageJobs = await getImageJobsByIds(eventObj.imageJobIds);
        eventObj.images = imageJobs
          .map((job) => ({
            id: job._id,
            publicId: job._id.toString(), // For frontend compatibility
            url: job.outputImageURL || job.sourceImageURL, // show something even if processing not completed
            status: job.status,
            errorMsg: job.errorMsg,
          }))
          .filter((image) => Boolean(image.url)); // drop images without any URL
      } else {
        eventObj.images = [];
      }
      return eventObj;
    })
  );

  return eventsWithImages;
};

export const getEventById = async (id) => {
  const event = await Event.findById(id);
  if (!event) {
    const error = new Error("Event not found");
    error.statusCode = 404;
    throw error;
  }

  const eventObj = event.toObject();
  
  // Populate images from image jobs
  if (eventObj.imageJobIds && eventObj.imageJobIds.length > 0) {
    const imageJobs = await getImageJobsByIds(eventObj.imageJobIds);
    eventObj.images = imageJobs.map((job) => ({
      id: job._id,
      publicId: job._id.toString(), // For frontend compatibility (imageJobId)
      url: job.outputImageURL || job.sourceImageURL,
      status: job.status,
      errorMsg: job.errorMsg,
    }));
  } else {
    eventObj.images = [];
  }

  return eventObj;
};

export const createEvent = async (eventData, files = []) => {
  let tutorName = eventData.tutor.name;

  // Jika hanya userID yang dikirim, ambil nama user dari database
  if (!tutorName && eventData.tutor.userID) {
    const user = await User.findById(eventData.tutor.userID);
    if (!user) {
      const error = new Error("Tutor user not found");
      error.statusCode = 404;
      throw error;
    }
    tutorName = user.name;
  }

  // Create event first
  const eventId = new mongoose.Types.ObjectId().toString();
  const event = new Event({
    _id: eventId,
    name: eventData.name,
    community: eventData.community,
    date: eventData.date,
    tutor: {
      type: eventData.tutor.type,
      userID: eventData.tutor.userID,
      name: tutorName,
    },
    imageJobIds: [],
    description: eventData.description,
    location: eventData.location,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await event.save();

  // Create image jobs for uploaded files
  const imageJobIds = [];
  if (files && files.length > 0) {
    for (const file of files) {
      try {
        const imageJob = await createImageJob(
          {
            entityType: "event",
            entityId: eventId,
          },
          file.buffer,
          file.mimetype,
          file.originalname
        );
        imageJobIds.push(imageJob._id.toString());
      } catch (error) {
        console.error("Error creating image job:", error);
        // Continue with other files even if one fails
      }
    }

    // Update event with imageJobIds
    event.imageJobIds = imageJobIds;
    await event.save();
  }

  return event;
};

export const updateEvent = async (id, eventData, files = []) => {
  try {
    const existingEvent = await Event.findById(id);
    if (!existingEvent) {
      const error = new Error("Event not found");
      error.statusCode = 404;
      throw error;
    }

    console.log("Update event data received:", eventData);
    console.log("Files received:", files?.length || 0);

    const updateData = {
      updatedAt: new Date(),
    };

    // Update basic fields
    if (eventData.name) updateData.name = eventData.name;
    if (eventData.community) updateData.community = eventData.community;
    if (eventData.date) updateData.date = eventData.date;
    if (eventData.description !== undefined) updateData.description = eventData.description;
    if (eventData.location !== undefined) updateData.location = eventData.location;

    // Handle tutor update
    if (eventData.tutor) {
      let tutorName = eventData.tutor.name;

      // If only userID is provided, fetch user name
      if (!tutorName && eventData.tutor.userID && eventData.tutor.type === "Internal") {
        try {
          const user = await User.findById(eventData.tutor.userID);
          if (user) {
            tutorName = user.name;
          }
        } catch (userError) {
          console.error("Error fetching user:", userError);
          // Continue without user name if fetch fails
        }
      }

      // Make sure tutor has required fields
      if (!tutorName) {
        const error = new Error("Tutor name is required");
        error.statusCode = 400;
        throw error;
      }

      updateData.tutor = {
        type: eventData.tutor.type,
        name: tutorName,
        ...(eventData.tutor.userID ? { userID: eventData.tutor.userID } : {}),
      };
    }

    // Create image jobs for new uploaded files
    const newImageJobIds = [];
    if (files && files.length > 0) {
      for (const file of files) {
        try {
          const imageJob = await createImageJob(
            {
              entityType: "event",
              entityId: id,
            },
            file.buffer,
            file.mimetype,
            file.originalname
          );
          newImageJobIds.push(imageJob._id.toString());
        } catch (uploadError) {
          console.error("Error creating image job:", uploadError);
          // Continue with other files
        }
      }

      // Merge existing imageJobIds with new ones
      updateData.imageJobIds = [
        ...(existingEvent.imageJobIds || []),
        ...newImageJobIds,
      ];
    }

    console.log("Update data to be applied:", updateData);

    const event = await Event.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: false, // Disable validators for partial updates
    });

    if (!event) {
      const error = new Error("Failed to update event");
      error.statusCode = 500;
      throw error;
    }

    return event;
  } catch (error) {
    console.error("Error in updateEvent service:", error);
    throw error;
  }
};

export const deleteEventImage = async (eventId, imageJobId) => {
  const event = await Event.findById(eventId);
  if (!event) {
    const error = new Error("Event not found");
    error.statusCode = 404;
    throw error;
  }

  // Delete image job
  await deleteImageJob(imageJobId);

  // Remove from event imageJobIds array
  event.imageJobIds = event.imageJobIds.filter((id) => id !== imageJobId);
  event.updatedAt = new Date();
  await event.save();

  return event;
};

export const deleteEvent = async (id) => {
  const event = await Event.findById(id);

  if (!event) {
    const error = new Error("Event not found");
    error.statusCode = 404;
    throw error;
  }

  // Delete all image jobs
  if (event.imageJobIds && event.imageJobIds.length > 0) {
    for (const jobId of event.imageJobIds) {
      try {
        await deleteImageJob(jobId);
      } catch (error) {
        console.error(`Error deleting image job ${jobId}:`, error);
        // Continue deleting other jobs
      }
    }
  }

  await Event.findByIdAndDelete(id);

  return event;
};
