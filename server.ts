import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// In-memory verification code store
interface VerificationEntry {
  code: string;
  expiresAt: number;
  attempts: number;
  createdAt: number;
  displayName?: string;
  age?: number;
}

const verificationStore = new Map<string, VerificationEntry>();

// Server-side email configuration settings state
const emailConfig = {
  provider: (process.env.EMAIL_SERVICE_PROVIDER || 'resend').toLowerCase(),
  resendApiKey: process.env.RESEND_API_KEY || '',
  sendgridApiKey: process.env.SENDGRID_API_KEY || '',
  emailFrom: process.env.EMAIL_FROM || 'locked in. <onboarding@resend.dev>',
};

// 1. GET Email Service Configuration Status
app.get('/api/auth/email-config', (req, res) => {
  const hasResend = Boolean(emailConfig.resendApiKey && emailConfig.resendApiKey.trim());
  const hasSendgrid = Boolean(emailConfig.sendgridApiKey && emailConfig.sendgridApiKey.trim());
  const isConfigured = hasResend || hasSendgrid;

  res.json({
    configured: isConfigured,
    provider: hasResend ? 'resend' : hasSendgrid ? 'sendgrid' : 'none',
    fromEmail: emailConfig.emailFrom,
    message: isConfigured
      ? `Email service active using ${hasResend ? 'Resend' : 'SendGrid'}`
      : 'No email service API key configured. Set RESEND_API_KEY or SENDGRID_API_KEY in environment variables.',
  });
});


// Helper to send email via Resend
async function sendViaResend(toEmail: string, code: string, displayName?: string) {
  const apiKey = emailConfig.resendApiKey.trim();
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured.');
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #0f172a; }
          .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 24px; border: 2px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .logo-badge { display: inline-block; background: #0f172a; color: #ffffff; font-weight: 900; font-size: 14px; padding: 6px 14px; border-radius: 9999px; letter-spacing: -0.5px; }
          h1 { font-size: 20px; font-weight: 800; margin-top: 20px; margin-bottom: 8px; color: #0f172a; letter-spacing: -0.5px; }
          p { font-size: 14px; line-height: 1.6; color: #475569; margin: 8px 0; }
          .code-box { background: #f0fdf4; border: 2px dashed #86efac; border-radius: 16px; padding: 20px; text-align: center; margin: 24px 0; }
          .code { font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #15803d; }
          .expiry { font-size: 12px; color: #64748b; margin-top: 6px; }
          .footer { font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 24px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo-badge">locked in.</div>
          <h1>Verify your creator email</h1>
          <p>Hey ${displayName ? displayName : 'young creator'},</p>
          <p>Welcome to locked in.! Enter this 6-digit verification code to confirm your email and activate your account:</p>
          <div class="code-box">
            <div class="code">${code}</div>
            <div class="expiry">Expires in 10 minutes</div>
          </div>
          <p>If you didn't request this verification code, you can safely disregard this email.</p>
          <div class="footer">
            locked in. — built for young makers, coders, and engineers.
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `Welcome to locked in.!\n\nYour 6-digit verification code is: ${code}\nThis code will expire in 10 minutes.\n\nHappy building!`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: emailConfig.emailFrom,
      to: [toEmail],
      subject: `Your locked in. verification code: ${code}`,
      html,
      text,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data && data.message ? data.message : `HTTP ${response.status}: Failed to send email via Resend`;
    throw new Error(errorMsg);
  }

  return data;
}

// Helper to send email via SendGrid
async function sendViaSendGrid(toEmail: string, code: string, displayName?: string) {
  const apiKey = emailConfig.sendgridApiKey.trim();
  if (!apiKey) {
    throw new Error('SENDGRID_API_KEY is not configured.');
  }

  const html = `
    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 2px solid #e2e8f0; border-radius: 20px; background: #ffffff;">
      <h2 style="color: #0f172a; margin-bottom: 6px;">locked in.</h2>
      <p style="color: #475569; font-size: 14px;">Hey ${displayName || 'Maker'},</p>
      <p style="color: #475569; font-size: 14px;">Your 6-digit email verification code is:</p>
      <div style="background: #f0fdf4; border: 2px dashed #86efac; border-radius: 14px; padding: 18px; text-align: center; margin: 20px 0;">
        <span style="font-family: monospace; font-size: 34px; font-weight: 900; letter-spacing: 8px; color: #15803d;">${code}</span>
      </div>
      <p style="color: #64748b; font-size: 12px;">This code expires in 10 minutes.</p>
    </div>
  `;

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: toEmail }] }],
      from: { email: emailConfig.emailFrom.replace(/.*<([^>]+)>.*/, '$1') || 'verify@lockedin.dev', name: 'locked in.' },
      subject: `Your locked in. verification code: ${code}`,
      content: [{ type: 'text/html', value: html }],
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`SendGrid API error (${response.status}): ${text}`);
  }

  return { success: true };
}

// 3. POST Trigger Real Email Verification Code
app.post('/api/auth/send-verification-code', async (req, res) => {
  try {
    const { email, age, displayName } = req.body;

    // Validate email
    const cleanEmail = (email || '').trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid email address.',
      });
    }

    // Validate 13+ age requirement
    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 13) {
      return res.status(400).json({
        success: false,
        error: 'Age requirement not met: Creators must be at least 13 years old to join locked in.',
      });
    }

    // Rate-limiting check: Prevent spamming within 30 seconds
    const existing = verificationStore.get(cleanEmail);
    if (existing && Date.now() - existing.createdAt < 30 * 1000) {
      const waitSec = Math.ceil((30 * 1000 - (Date.now() - existing.createdAt)) / 1000);
      return res.status(429).json({
        success: false,
        error: `Please wait ${waitSec} seconds before requesting another code.`,
      });
    }

    // Generate real 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in verification store (valid for 10 minutes)
    verificationStore.set(cleanEmail, {
      code,
      expiresAt: Date.now() + 10 * 60 * 1000,
      attempts: 0,
      createdAt: Date.now(),
      displayName: displayName || 'Maker',
      age: parsedAge,
    });

    console.log(`[locked in. Auth] 6-digit verification code generated for ${cleanEmail}: ${code}`);

    // Determine configured email provider
    const hasResend = Boolean(emailConfig.resendApiKey && emailConfig.resendApiKey.trim());
    const hasSendgrid = Boolean(emailConfig.sendgridApiKey && emailConfig.sendgridApiKey.trim());

    if (hasResend || (emailConfig.provider === 'resend' && hasResend)) {
      try {
        await sendViaResend(cleanEmail, code, displayName);
        return res.json({
          success: true,
          message: `Verification code sent to ${cleanEmail} via Resend.`,
          provider: 'resend',
          email: cleanEmail,
        });
      } catch (err: any) {
        console.error('[Resend Error]', err);
        return res.status(502).json({
          success: false,
          error: `Failed to deliver email via Resend: ${err.message}. Check your RESEND_API_KEY.`,
          provider: 'resend',
          previewCode: process.env.NODE_ENV !== 'production' ? code : undefined,
        });
      }
    } else if (hasSendgrid || emailConfig.provider === 'sendgrid') {
      try {
        await sendViaSendGrid(cleanEmail, code, displayName);
        return res.json({
          success: true,
          message: `Verification code sent to ${cleanEmail} via SendGrid.`,
          provider: 'sendgrid',
          email: cleanEmail,
        });
      } catch (err: any) {
        console.error('[SendGrid Error]', err);
        return res.status(502).json({
          success: false,
          error: `Failed to deliver email via SendGrid: ${err.message}. Check your SENDGRID_API_KEY.`,
          provider: 'sendgrid',
          previewCode: process.env.NODE_ENV !== 'production' ? code : undefined,
        });
      }
    } else {
      // No external API key provided in environment yet
      // Return clear status with previewCode for seamless testing
      console.warn(
        `[locked in. Auth] No RESEND_API_KEY or SENDGRID_API_KEY set. In dev/preview mode, code is: ${code}`
      );

      return res.json({
        success: true,
        simulated: true,
        provider: 'none',
        message: `Verification code generated. To send real emails to ${cleanEmail}, add RESEND_API_KEY to your environment variables.`,
        email: cleanEmail,
        previewCode: code,
      });
    }
  } catch (err: any) {
    console.error('[Auth Send Code Error]', err);
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred while sending the verification code.',
    });
  }
});

// 4. POST Verify 6-digit Code
app.post('/api/auth/verify-code', (req, res) => {
  try {
    const { email, code } = req.body;

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanCode = (code || '').trim().replace(/\D/g, '');

    if (!cleanEmail || !cleanCode) {
      return res.status(400).json({
        success: false,
        error: 'Email and 6-digit code are required.',
      });
    }

    if (cleanCode.length !== 6) {
      return res.status(400).json({
        success: false,
        error: 'Verification code must be 6 digits.',
      });
    }

    const entry = verificationStore.get(cleanEmail);

    if (!entry) {
      return res.status(404).json({
        success: false,
        error: 'No active verification code found for this email. Please request a new code.',
      });
    }

    if (Date.now() > entry.expiresAt) {
      verificationStore.delete(cleanEmail);
      return res.status(410).json({
        success: false,
        error: 'This verification code has expired. Please request a new code.',
      });
    }

    entry.attempts += 1;
    if (entry.attempts > 5) {
      verificationStore.delete(cleanEmail);
      return res.status(429).json({
        success: false,
        error: 'Too many incorrect attempts. Please request a fresh verification code.',
      });
    }

    if (entry.code !== cleanCode) {
      const remaining = 5 - entry.attempts;
      return res.status(400).json({
        success: false,
        error: `Incorrect verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
      });
    }

    // Success: code verified!
    verificationStore.delete(cleanEmail);

    return res.json({
      success: true,
      verified: true,
      email: cleanEmail,
      message: 'Email address verified successfully!',
    });
  } catch (err: any) {
    console.error('[Auth Verify Code Error]', err);
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred while verifying the code.',
    });
  }
});

// Start server with Vite middleware in dev or static files in prod
async function startServer() {
  const PORT = 3000;
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[locked in.] Full-stack dev server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server Start Error]', err);
  process.exit(1);
});
