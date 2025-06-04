function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit
}

function generateOtpEmailTemplate(email, otp) {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #4A90E2;">Verify Your Email Address</h2>
      <p>Hello <b>${email}</b>,</p>
      <p>Thank you for registering! Please use the OTP code below to verify your email address:</p>
  
      <div style="font-size: 28px; font-weight: bold; background-color: #f2f2f2; padding: 15px; border-radius: 8px; text-align: center; letter-spacing: 5px;">
        ${otp}
      </div>
  
      <p style="margin-top: 20px;">This OTP is valid for <b>5 minutes</b>. Please do not share this code with anyone.</p>
  
      <hr style="margin: 30px 0;" />
      <p style="font-size: 12px; color: #888;">
        If you did not request this, please ignore this email.
        <br />— Your Company Team
      </p>
    </div>
    `;
  }
  
module.exports = {generateOTP,generateOtpEmailTemplate}