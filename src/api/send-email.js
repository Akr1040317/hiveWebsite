// api/send-email.js
import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// For production, update CORS to allow your domain (or remove if using a wildcard during development)
app.use(cors({ origin: 'https://www.hivespelling.com' }));
app.use(bodyParser.json());

const SMTP_SERVER = 'smtp.gmail.com';
const SMTP_PORT = 587;
const SENDER_EMAIL = 'erastogi@hivespelling.com';
const PASSWORD = process.env.EMAIL_APP_PASSWORD;

if (!PASSWORD) {
  console.error("❗ Error: The environment variable 'EMAIL_APP_PASSWORD' is not set.");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: SMTP_SERVER,
  port: SMTP_PORT,
  secure: false,
  auth: {
    user: SENDER_EMAIL,
    pass: PASSWORD,
  },
});

app.post('/send-email', async (req, res) => {
  const { subject, body, recipient } = req.body;
  const mailOptions = {
    from: SENDER_EMAIL,
    to: recipient,
    subject,
    text: body,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.response);
    res.json({ success: true, info });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Do not call app.listen(); export the app for Vercel to use.
export default app;
