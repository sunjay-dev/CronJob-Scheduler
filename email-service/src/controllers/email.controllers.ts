import type { Request, Response } from "express";
import sendEmail from "../lib/sendEmail.js";

export function handleHomeRoute(req: Request, res: Response) {
  return res.status(200).send("Hey from email service");
}

export async function handleSendEmail(req: Request, res: Response) {
  const { name, email, template, data } = req.body;

  try {
    await sendEmail({ name, email, template, data });
    return res.status(200).json({ message: "Email sent", body: { name, email, template, data } });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
