interface EmailProps {
  email: string;
  template: "FORGOT_PASSWORD" | "JOB_COOLDOWN";
  data?: Record<string, any>;
}

export const queueEmail = async ({ email, template, data }: EmailProps): Promise<void> => {
  try {
    const response = await fetch(
      `https://qstash.upstash.io/v2/publish/${process.env.EMAIL_SERVICE_URL}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.QSTASH_TOKEN}`,
          "Content-Type": "application/json",
          "Upstash-Forward-Authorization": `Bearer ${process.env.EMAIL_SERVICE_SECRET}`
        },
        body: JSON.stringify({ email, template, data })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Qstash failed: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.error("Error queueing email:", error);
    throw error;
  }
};
