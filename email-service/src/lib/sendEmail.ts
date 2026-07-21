import { Resend } from "resend";
import type { EmailSchema } from "../schemas/email.schema.js";
import { forgetPasswordTemplete, jobFailedTemplate, confirmEmailTemplate } from "../emailTemplates/index.js";
import env from "../config/env.config.js";

export default async function sendEmail({ email, name, template, data }: EmailSchema): Promise<void> {
  const resend = new Resend(env.RESEND_EMAIL_API_KEY);
  let emailTemplate: string;
  let subject: string;

  if (template === "FORGOT_PASSWORD") {
    emailTemplate = forgetPasswordTemplete(name, data?.url);
    subject = `Password Reset Request ${new Date().toISOString().split("T")[1]}`;
  } else if (template === "JOB_FAILED") {
    emailTemplate = jobFailedTemplate({
      name,
      jobName: data?.jobName,
      url: data?.url,
      method: data?.method,
      error: data?.error,
      lastRunAt: data?.lastRunAt,
    });

    subject = `Job "${data?.jobName}" Disabled After Multiple Failures`;
  } else {
    emailTemplate = confirmEmailTemplate(name, data?.otp);
    subject = `Welcome! Confirm Your Email to Get Started`;
  }

  try {
    await resend.emails.send({
      from: `CronJon Scheduler <${env.SENDEREMAIL}>`,
      to: email,
      subject,
      html: emailTemplate,
    });
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error);
  }
}
