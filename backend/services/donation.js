import Donation from "../models/donation.js";
import mongoose from "mongoose";

export const getAllDonations = async (filters = {}) => {
  const query = {};

  if (filters.donationType) {
    query.donationType = filters.donationType;
  }

  if (filters.source) {
    query.source = new RegExp(filters.source, "i");
  }

  if (filters.program) {
    query.program = new RegExp(filters.program, "i");
  }

  if (filters.startDate && filters.endDate) {
    query.date = {
      $gte: new Date(filters.startDate),
      $lte: new Date(filters.endDate),
    };
  }

  return await Donation.find(query).sort({ date: -1 });
};

export const getDonationById = async (id) => {
  const donation = await Donation.findById(id);
  if (!donation) {
    const error = new Error("Donation not found");
    error.statusCode = 404;
    throw error;
  }
  return donation;
};

export const createDonation = async (donationData) => {
  const donationType = donationData.donationType;

  if (!donationData.program) {
    const error = new Error("Program is required");
    error.statusCode = 400;
    throw error;
  }

  if (donationType === "Cash") {
    if (!donationData.cashDetails || !donationData.cashDetails.amount) {
      const error = new Error("Cash amount is required for Cash donation");
      error.statusCode = 400;
      throw error;
    }
    if (donationData.inKindDetails) {
      const error = new Error(
        "inKindDetails should not be provided for Cash donation"
      );
      error.statusCode = 400;
      throw error;
    }
  } else if (donationType === "InKind") {
    if (
      !donationData.inKindDetails ||
      !donationData.inKindDetails.estimatedValue ||
      !donationData.inKindDetails.description ||
      !donationData.inKindDetails.category
    ) {
      const error = new Error(
        "estimatedValue, description, and category are required for InKind donation"
      );
      error.statusCode = 400;
      throw error;
    }
    if (donationData.cashDetails) {
      const error = new Error(
        "cashDetails should not be provided for InKind donation"
      );
      error.statusCode = 400;
      throw error;
    }
  } else {
    const error = new Error("Invalid donation type");
    error.statusCode = 400;
    throw error;
  }

  const donation = new Donation({
    _id: new mongoose.Types.ObjectId().toString(),
    donationType: donationType,
    source: donationData.source,
    program: donationData.program,
    cashDetails: donationData.cashDetails,
    inKindDetails: donationData.inKindDetails,
    date: donationData.date,
  });

  return await donation.save();
};

export const updateDonation = async (id, donationData) => {
  const donationType = donationData.donationType;

  if (!donationData.program) {
    const error = new Error("Program is required");
    error.statusCode = 400;
    throw error;
  }

  if (donationType === "Cash") {
    if (!donationData.cashDetails || !donationData.cashDetails.amount) {
      const error = new Error("Cash amount is required for Cash donation");
      error.statusCode = 400;
      throw error;
    }
    if (donationData.inKindDetails) {
      const error = new Error(
        "inKindDetails should not be provided for Cash donation"
      );
      error.statusCode = 400;
      throw error;
    }
  } else if (donationType === "InKind") {
    if (
      !donationData.inKindDetails ||
      !donationData.inKindDetails.estimatedValue ||
      !donationData.inKindDetails.description ||
      !donationData.inKindDetails.category
    ) {
      const error = new Error(
        "estimatedValue, description, and category are required for InKind donation"
      );
      error.statusCode = 400;
      throw error;
    }
    if (donationData.cashDetails) {
      const error = new Error(
        "cashDetails should not be provided for InKind donation"
      );
      error.statusCode = 400;
      throw error;
    }
  } else {
    const error = new Error("Invalid donation type");
    error.statusCode = 400;
    throw error;
  }

  const updateData = {
    donationType: donationType,
    source: donationData.source,
    program: donationData.program,
    cashDetails: donationData.cashDetails,
    inKindDetails: donationData.inKindDetails,
    date: donationData.date,
  };

  const donation = await Donation.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!donation) {
    const error = new Error("Donation not found");
    error.statusCode = 404;
    throw error;
  }

  return donation;
};

export const deleteDonation = async (id) => {
  const donation = await Donation.findByIdAndDelete(id);

  if (!donation) {
    const error = new Error("Donation not found");
    error.statusCode = 404;
    throw error;
  }

  return donation;
};

export const getDonationStats = async () => {
  const stats = await Donation.aggregate([
    {
      $group: {
        _id: "$donationType",
        totalAmount: {
          $sum: {
            $cond: [
              { $eq: ["$donationType", "Cash"] },
              "$cashDetails.amount",
              "$inKindDetails.estimatedValue",
            ],
          },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  return stats;
};
