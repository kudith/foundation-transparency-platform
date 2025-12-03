import { sendContactEmail } from "../services/contact.js";

export const submitContact = async (req, res, next) => {
  try {
    const { name, email, topic, message } = req.body;

    // Validate required fields
    if (!name || !email || !topic || !message) {
      return res.status(400).json({
        success: false,
        message: "Semua field harus diisi",
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Format email tidak valid",
      });
    }

    await sendContactEmail({ name, email, topic, message });

    res.status(200).json({
      success: true,
      message: "Pesan berhasil dikirim. Tim kami akan menghubungi Anda segera.",
    });
  } catch (error) {
    console.error("Contact email error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengirim pesan. Silakan coba lagi nanti.",
    });
  }
};

export default {
  submitContact,
};

