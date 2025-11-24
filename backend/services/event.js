import Event from "../models/event.js";
import User from "../models/user.js";
import mongoose from "mongoose";
import {
  uploadToCloudinary,
  deleteMultipleFromCloudinary,
} from "../config/cloudinary.js";
import { bufferToDataURI } from "../utils/upload.js";

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

  return await Event.find(query).sort({ date: -1 });
};

export const getEventById = async (id) => {
  const event = await Event.findById(id);
  if (!event) {
    const error = new Error("Event not found");
    error.statusCode = 404;
    throw error;
  }
  return event;
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

  // Upload images to Cloudinary
  const uploadedImages = [];
  if (files && files.length > 0) {
    for (const file of files) {
      const dataURI = bufferToDataURI(file.buffer, file.mimetype);
      const uploadResult = await uploadToCloudinary(dataURI, "events");
      uploadedImages.push(uploadResult);
    }
  }

  const event = new Event({
    _id: new mongoose.Types.ObjectId().toString(),
    name: eventData.name,
    community: eventData.community,
    date: eventData.date,
    tutor: {
      type: eventData.tutor.type,
      userID: eventData.tutor.userID,
      name: tutorName,
    },
    images: uploadedImages,
    description: eventData.description,
    location: eventData.location,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return await event.save();
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

    // Upload new images if provided
    const uploadedImages = [];
    if (files && files.length > 0) {
      for (const file of files) {
        try {
          const dataURI = bufferToDataURI(file.buffer, file.mimetype);
          const uploadResult = await uploadToCloudinary(dataURI, "events");
          uploadedImages.push(uploadResult);
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }
      }
    }

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

    // Update images - merge existing with new
    if (uploadedImages.length > 0) {
      updateData.images = [
        ...(existingEvent.images || []),
        ...uploadedImages,
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

export const deleteEventImage = async (eventId, publicId) => {
  const event = await Event.findById(eventId);
  if (!event) {
    const error = new Error("Event not found");
    error.statusCode = 404;
    throw error;
  }

  // Delete from Cloudinary
  await deleteMultipleFromCloudinary([publicId]);

  // Remove from event images array
  event.images = event.images.filter((img) => img.publicId !== publicId);
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

  // Delete all images from Cloudinary
  if (event.images && event.images.length > 0) {
    const publicIds = event.images.map((img) => img.publicId);
    await deleteMultipleFromCloudinary(publicIds);
  }

  await Event.findByIdAndDelete(id);

  return event;
};
