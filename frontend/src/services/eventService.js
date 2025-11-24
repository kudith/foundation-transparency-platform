import apiClient from "../config/api";

/**
 * Event Service
 * Service untuk mengelola data events
 */

// Get all events
export const getAllEvents = async () => {
  try {
    const response = await apiClient.get("/events");
    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error) {
    console.error("Error fetching events:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal mengambil data events",
      data: [],
    };
  }
};

// Get event by ID
export const getEventById = async (id) => {
  try {
    const response = await apiClient.get(`/events/${id}`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error fetching event:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal mengambil data event",
      data: null,
    };
  }
};

// Create new event with images
export const createEvent = async (eventData, images = []) => {
  try {
    const formData = new FormData();
    
    // Append event data
    formData.append("name", eventData.name);
    formData.append("community", eventData.community);
    formData.append("date", eventData.date);
    formData.append("tutor", JSON.stringify(eventData.tutor));
    
    if (eventData.description) {
      formData.append("description", eventData.description);
    }
    if (eventData.location) {
      formData.append("location", eventData.location);
    }
    
    // Append images
    for (const image of images) {
      formData.append("images", image);
    }

    const response = await apiClient.post("/events", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    return {
      success: true,
      data: response.data.data,
      message: "Event berhasil dibuat",
    };
  } catch (error) {
    console.error("Error creating event:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal membuat event",
    };
  }
};

// Update event with optional new images
export const updateEvent = async (id, eventData, images = []) => {
  try {
    const formData = new FormData();
    
    // Append only changed fields
    if (eventData.name) formData.append("name", eventData.name);
    if (eventData.community) formData.append("community", eventData.community);
    if (eventData.date) formData.append("date", eventData.date);
    if (eventData.tutor) formData.append("tutor", JSON.stringify(eventData.tutor));
    if (eventData.description !== undefined) formData.append("description", eventData.description);
    if (eventData.location !== undefined) formData.append("location", eventData.location);
    
    // Append new images if any
    for (const image of images) {
      formData.append("images", image);
    }

    const response = await apiClient.put(`/events/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    return {
      success: true,
      data: response.data.data,
      message: "Event berhasil diupdate",
    };
  } catch (error) {
    console.error("Error updating event:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal mengupdate event",
    };
  }
};

// Delete event
export const deleteEvent = async (id) => {
  try {
    await apiClient.delete(`/events/${id}`);
    return {
      success: true,
      message: "Event berhasil dihapus",
    };
  } catch (error) {
    console.error("Error deleting event:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal menghapus event",
    };
  }
};

// Delete event image
export const deleteEventImage = async (eventId, publicId) => {
  try {
    const response = await apiClient.delete(
      `/events/${eventId}/images/${publicId}`
    );
    return {
      success: true,
      data: response.data.data,
      message: "Gambar berhasil dihapus",
    };
  } catch (error) {
    console.error("Error deleting image:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal menghapus gambar",
    };
  }
};

// Helper function to determine event status based on date
export const getEventStatus = (eventDate) => {
  const now = new Date();
  const date = new Date(eventDate);
  const diffTime = date - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return "completed";
  } else if (diffDays === 0) {
    return "ongoing";
  } else {
    return "upcoming";
  }
};

