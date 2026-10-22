export interface EmailConfigStatus {
  configured: boolean;
  provider: 'resend' | 'sendgrid' | 'none';
  fromEmail: string;
  message: string;
}

export interface SendCodeResponse {
  success: boolean;
  message?: string;
  error?: string;
  provider?: string;
  simulated?: boolean;
  previewCode?: string;
}

export interface VerifyCodeResponse {
  success: boolean;
  verified?: boolean;
  error?: string;
  message?: string;
}

/**
 * Fetch current email service configuration status from the server
 */
export async function getEmailConfigStatus(): Promise<EmailConfigStatus> {
  try {
    const res = await fetch('/api/auth/email-config');
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn('Failed to load email config from server:', err);
    return {
      configured: false,
      provider: 'none',
      fromEmail: 'locked in. <onboarding@resend.dev>',
      message: 'Server offline or using local mode.',
    };
  }
}

/**
 * Trigger an API request to send a real 6-digit verification code to the user's email
 */
export async function sendVerificationCode(
  email: string,
  age: number,
  displayName?: string
): Promise<SendCodeResponse> {
  try {
    const res = await fetch('/api/auth/send-verification-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, age, displayName }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${res.status}: Failed to send verification code`,
        previewCode: data.previewCode,
      };
    }

    return data;
  } catch (err: any) {
    console.error('sendVerificationCode error:', err);
    return {
      success: false,
      error: 'Network connection error while contacting verification server.',
    };
  }
}

/**
 * Verify the 6-digit code entered by the user
 */
export async function verifyCode(email: string, code: string): Promise<VerifyCodeResponse> {
  try {
    const res = await fetch('/api/auth/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${res.status}: Verification failed`,
      };
    }

    return data;
  } catch (err: any) {
    console.error('verifyCode error:', err);
    return {
      success: false,
      error: 'Network connection error while verifying code.',
    };
  }
}

