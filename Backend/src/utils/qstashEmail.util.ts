interface Props {
    email: string, 
    name: string, 
    url: string
}
export const queueForgotPasswordEmail = async ({ email, name, url }: Props): Promise<void> => {
    await fetch(`https://qstash.upstash.io/v2/publish/${process.env.EMAIL_SERVICE_URL}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.QSTASH_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, name, url })
    });
};
