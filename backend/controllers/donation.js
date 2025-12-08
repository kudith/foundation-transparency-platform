import * as donationService from "../services/donation.js";

export const getAllDonations = async (req, res, next) => {
  try {
    const donations = await donationService.getAllDonations(req.query);
    res.json({ success: true, data: donations });
  } catch (error) {
    next(error);
  }
};

export const getDonationById = async (req, res, next) => {
  try {
    const donation = await donationService.getDonationById(req.params.id);
    res.json({ success: true, data: donation });
  } catch (error) {
    next(error);
  }
};

export const createDonation = async (req, res, next) => {
  try {
    const donation = await donationService.createDonation(req.body);
    res.status(201).json({ success: true, data: donation });
  } catch (error) {
    next(error);
  }
};

export const updateDonation = async (req, res, next) => {
  try {
    const donation = await donationService.updateDonation(
      req.params.id,
      req.body
    );
    res.json({ success: true, data: donation });
  } catch (error) {
    next(error);
  }
};

export const deleteDonation = async (req, res, next) => {
  try {
    await donationService.deleteDonation(req.params.id);
    res.json({ success: true, message: "Donation deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getDonationStats = async (req, res, next) => {
  try {
    const stats = await donationService.getDonationStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};
