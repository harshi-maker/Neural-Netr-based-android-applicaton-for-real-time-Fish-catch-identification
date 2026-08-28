const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Transporter Configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'false' ? false : true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verify SMTP connection on startup
transporter.verify((error) => {
  if (error) {
    console.warn('⚠️ SMTP Connection Warning:', error.message);
    console.warn('Please make sure SMTP_USER and SMTP_PASS are configured in .env');
  } else {
    console.log('✅ SMTP Mail Server is connected and ready to send messages');
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Main Contact Endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { teamName, email, phone, message } = req.body;

    // Server-side validation
    if (!teamName || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: teamName, email, and message are mandatory.'
      });
    }

    const recipient = process.env.RECIPIENT_EMAIL || 'hkottapa@student.gitam.edu';

    const mailOptions = {
      from: `"Team Contact Form" <${process.env.SMTP_USER || 'no-reply@gitam.in'}>`,
      to: recipient,
      replyTo: email,
      subject: `[Team Inquiry] Message from ${teamName}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; color: #1a202c;">
          <div style="background-color: #0f172a; padding: 24px; color: #ffffff; text-align: center;">
            <h2 style="margin: 0; font-size: 20px;">New Contact & Team Registration</h2>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #94a3b8;">Received from GITAM University Portal</p>
          </div>
          
          <div style="padding: 24px;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 130px;"><strong>Team Name:</strong></td>
                <td style="padding: 8px 0; font-size: 15px; font-weight: 600; color: #0f172a;">${teamName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px;"><strong>Sender Email:</strong></td>
                <td style="padding: 8px 0; font-size: 15px;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px;"><strong>Phone:</strong></td>
                <td style="padding: 8px 0; font-size: 15px; color: #334155;">${phone || 'Not provided'}</td>
              </tr>
            </table>

            <div style="margin-top: 16px;">
              <strong style="display: block; margin-bottom: 8px; color: #0f172a; font-size: 14px;">Message:</strong>
              <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 14px; border-radius: 4px; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</div>
            </div>
          </div>

          <div style="background-color: #f1f5f9; padding: 12px 24px; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0;">
            This email was generated automatically by your website contact form.
          </div>
        </div>
      `
    };

    // If credentials aren't configured yet, provide a friendly simulation log
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('📬 [SIMULATED EMAIL LOG] (Configure .env with SMTP credentials for real transmission):');
      console.log({ teamName, email, phone, message, recipient });
      return res.status(200).json({
        success: true,
        message: 'Server received message (Simulated mode: Add SMTP credentials to .env to deliver real emails).'
      });
    }

    await transporter.sendMail(mailOptions);
    return res.status(200).json({
      success: true,
      message: 'Email delivered successfully.'
    });

  } catch (error) {
    console.error('Email Dispatch Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to send email. Check server logs.'
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Contact API server running at http://localhost:${PORT}`);
});
