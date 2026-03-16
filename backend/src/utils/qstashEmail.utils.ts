import logger from "./logger.utils.js";

interface EmailProps {
  name: string;
  email: string;
  template: "FORGOT_PASSWORD" | "JOB_FAILED" | "EMAIL_VERIFY";
  data?: Record<string, unknown>;
}

export const queueEmail = async ({ name, email, template, data }: EmailProps): Promise<void> => {
  if ((process.env.ENABLE_EMAIL_SERVICE as string) !== "true") {
    logger.info({ message: "Email sent to: ", name, email, template, data });
    logger.info({ message: "Email service is disabled. Skipping actual email sending." });
    return;
  }

  try {
    const response = await fetch(`https://qstash.upstash.io/v2/publish/${process.env.EMAIL_SERVICE_URL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.QSTASH_TOKEN as string}`,
        "Content-Type": "application/json",
        "Upstash-Forward-Authorization": `Bearer ${process.env.EMAIL_SERVICE_SECRET as string}`,
      },
      body: JSON.stringify({ name, email, template, data }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Qstash failed: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    logger.error({ message: "Error queueing email:", error });
    throw error;
  }
};
