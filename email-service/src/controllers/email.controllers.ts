import { Request, Response, NextFunction } from "express";
import sendEmail from "../lib/sendEmail";

export const handleHomeRoute = (req: Request, res: Response, next: NextFunction): void => {
  res.status(200).send("I'm running");
}

export const handleSendEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  
  const { email, url, name } = req.body;

  try {
    await sendEmail({ email, url, name });
    res.status(200).json({message: 'Email sent', body: {email, url, name}});

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
}
