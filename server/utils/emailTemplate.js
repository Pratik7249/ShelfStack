export function generateVerificationOtpEmailTemplate(otpCode) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
      <h2 style="color: #007bff; text-align: center;">Verify Your Email Address</h2>
      <p style="font-size: 16px; color: #666;">Dear User,</p>
      <p style="font-size: 16px; color: #666; text-align: center;">To complete your registration or login, please use the following OTP:</p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="display: inline-block; background: #007bff; color: #fff; font-size: 24px; font-weight: bold; padding: 12px 20px; border-radius: 5px;">
          ${otpCode}
        </span>
      </div>
      <p style="font-size: 16px; color: #cc0000; text-align: center;">This code is valid for 5 minutes. Please do not share this code with anyone.</p>
      <p style="font-size: 14px; color: #666; text-align: center;">If you did not request this email, please ignore it.</p>
      <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #888;">
        <p>Thank you,</p>
        <p style="font-weight: bold;">BookAtEase Team</p>
        <p style="font-size: 12px; color: #444;">This is an automated message. Please do not reply to this email.</p>
      </footer>
    </div>
  `;
}

export function generateForgotPasswordEmailTemplate(resetPasswordUrl) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
  <h2 style="color: #007bff; text-align: center;">Reset Your Password</h2>
  
  <p style="font-size: 16px; color: #666;">Dear User,</p>
  <p style="font-size: 16px; color: #666; text-align: center;">
    To reset your password, please click the button below:
  </p>
  
  <div style="text-align: center; margin: 20px 0;">
    <a href="${resetPasswordUrl}" style="display: inline-block; background: #007bff; color: #fff; font-size: 16px; font-weight: bold; padding: 12px 20px; border-radius: 5px; text-decoration: none; max-width: 100%;">
      Reset Password
    </a>
  </div>
  
  <p style="font-size: 14px; color: #666; text-align: center;">
    Or copy and paste this link into your browser:
  </p>
  
  <p style="word-break: break-all; text-align: center; font-size: 14px; color: #007bff;">
    <a href="${resetPasswordUrl}" style="color: #007bff; text-decoration: none;">
      ${resetPasswordUrl}
    </a>
  </p>

  <p style="font-size: 14px; color: #999; text-align: center;">
    If you did not request this, please ignore this email.
  </p>
</div>`;

}
