// api/send-email.js
import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Define your fixed allowed origins
const allowedOrigins = [
  'https://www.hivespelling.com'
];

// Define a regular expression for allowed Vercel preview domains.
// Adjust this regex as needed to match your preview domain pattern.
const previewOriginRegex = /^https:\/\/hive-website-[\w-]+\.vercel\.app$/;

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      // Allow if origin is explicitly allowed
      if (allowedOrigins.includes(origin)) return callback(null, true);

      // Allow if origin matches the preview pattern
      if (previewOriginRegex.test(origin)) return callback(null, true);

      // Otherwise, reject
      return callback(new Error('Not allowed by CORS'), false);
    },
  })
);

// Handle preflight requests
app.options('*', cors());

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
  secure: false, // Use TLS
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
    // Fallback: set the header if not already set
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.json({ success: true, info });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Export the app for Vercel (do not call app.listen())
export default app;
