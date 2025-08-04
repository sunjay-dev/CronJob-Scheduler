import { Resend } from 'resend';

interface EmailParams {
    url: string;
    email: string;
    name: string
}

export default async function sendEmail({ url, email, name }: EmailParams): Promise<void> {

    const resend = new Resend(process.env.RESEND_EMAIL_API_KEY!);
    const emailTemplate = `
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9fafb;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 40px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #9810FA;
            margin-top: 0;
        }
        p {
            color: #555;
        }
        .reset-link a {
            font-size: 18px;
            font-weight: bold;
            color: #9810FA;
            text-decoration: none;
        }
        .reset-link a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Password Reset Request</h1>
        <p>Hi ${name},</p>
        <p>We received a request to reset your password. Click the link below to reset your password:</p>
        <p class="reset-link"><a href="${url}">Reset Password</a></p>
        <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
        <p>Thank you,</p>
        <p>Team CronJon schedular</p>
    </div>
</body>
</html>
`;

    try {
        await resend.emails.send({
            from: process.env.SENDEREMAIL!,
            to: email,
            subject: 'Password Reset Request',
            html: emailTemplate,
        });
        console.log(`Email sent to ${email}`);
    } catch (err) {
        console.error(`Failed to send email to ${email}:`, err);
    }
}