import nodemailer from "nodemailer";
import config from "../config/index.js";

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

export const sendContactEmail = async ({ name, email, topic, message }) => {
  const mailOptions = {
    from: `"Veritas Pelita Contact" <${config.email.user}>`,
    to: config.email.recipient,
    replyTo: email,
    subject: `[Veritas Contact] ${topic} - dari ${name}`,
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fafafa; border: 1px solid #e0e0e0;">
        <div style="border-bottom: 2px solid #1a1a1a; padding-bottom: 20px; margin-bottom: 20px;">
          <h1 style="margin: 0; color: #1a1a1a; font-size: 24px; font-weight: 600;">Pesan Kontak Baru</h1>
          <p style="margin: 8px 0 0; color: #666; font-size: 14px;">Veritas Pelita Nusantara</p>
        </div>
        
        <div style="background-color: #fff; padding: 20px; border: 1px solid #e0e0e0; margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px; width: 100px;">Nama</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #1a1a1a; font-size: 14px;"><strong>${name}</strong></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Email</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #1a1a1a; font-size: 14px;">
                <a href="mailto:${email}" style="color: #1a1a1a;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Topik</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #1a1a1a; font-size: 14px;">
                <span style="background-color: #1a1a1a; color: #fff; padding: 4px 12px; font-size: 12px;">${topic}</span>
              </td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #fff; padding: 20px; border: 1px solid #e0e0e0;">
          <h3 style="margin: 0 0 12px; color: #1a1a1a; font-size: 16px; font-weight: 600;">Pesan:</h3>
          <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${message}</p>
        </div>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center;">
          <p style="margin: 0; color: #999; font-size: 12px;">
            Email ini dikirim dari form kontak website Veritas Pelita Nusantara.<br>
            Balas langsung ke email ini untuk merespons pengirim.
          </p>
        </div>
      </div>
    `,
    text: `
Pesan Kontak Baru - Veritas Pelita Nusantara

Nama: ${name}
Email: ${email}
Topik: ${topic}

Pesan:
${message}

---
Email ini dikirim dari form kontak website Veritas Pelita Nusantara.
    `.trim(),
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};

export const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log("Email transporter is ready");
    return true;
  } catch (error) {
    console.error("Email transporter verification failed:", error.message);
    return false;
  }
};

export default {
  sendContactEmail,
  verifyEmailConnection,
};


