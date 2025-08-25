export default function confirmEmailTemplate(name: string, otp: string) {
  return `
  <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Email Verification</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 30px 15px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="background-color: #8b5cf6; padding: 20px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Verify Your Email</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 30px;">
              <p style="font-size: 16px; color: #333333; margin-bottom: 20px;">
                Hi <strong>${name}</strong>,
              </p>

              <p style="font-size: 15px; color: #444444; margin-bottom: 25px;">
                Welcome to <strong>CronJon Scheduler</strong> 🎉 <br/><br/>
                To complete your registration, please enter the following verification code in the app:
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <div style="display: inline-block; background: #f3f4f6; padding: 16px 28px; border-radius: 8px; font-size: 28px; font-weight: bold; letter-spacing: 8px; color: #111111; border: 1px solid #e5e7eb;">
                  ${otp}
                </div>
              </div>

               <p style="font-size: 14px; color: #666666; margin-top: 20px;">
                This code will expire in 10 minutes for your security. <br/>
                If you did not sign up for an account, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background: #f3f4f6; padding: 18px; font-size: 12px; color: #666666; line-height: 1.6;">
              © 2025 CronJon Scheduler. All rights reserved. <br/>
              You are receiving this email because you created an account on CronJon Scheduler.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
