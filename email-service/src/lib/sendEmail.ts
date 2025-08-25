import { Resend } from 'resend';
import type { EmailSchema } from '../schemas/email.schema';
import {forgetPasswordTemplete, jobFailedTemplate, confirmEmailTemplate} from '../emailTemplates';

export default async function sendEmail({ email, name, template, data }: EmailSchema): Promise<void> {
  const resend = new Resend(process.env.RESEND_EMAIL_API_KEY!);
  let emailTemplate = ``;
  let subject = ``;

  if (template === 'FORGOT_PASSWORD') {
    emailTemplate = forgetPasswordTemplete(name, data?.url);
    subject = `Password Reset Request ${new Date().toISOString().split('T')[1]}`
  }
  
  else if (template === 'JOB_FAILED') {
    emailTemplate = jobFailedTemplate({
      name, jobName: data?.jobName ,
      url: data?.url,
      method: data?.method,
      error: data?.error ,
      lastRunAt: data?.lastRunAt
    });
    
    subject = `Job "${data?.jobName}" Disabled After Multiple Failures`
  }
  else {
    emailTemplate  = confirmEmailTemplate(name, data?.otp);
    subject = `Welcome! Confirm Your Email to Get Started`;
  }

  try {
    await resend.emails.send({
      from: `CronJon Scheduler <${process.env.SENDEREMAIL!}>`,
      to: email,
      subject,
      html: emailTemplate,
    });
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error);
  }
}