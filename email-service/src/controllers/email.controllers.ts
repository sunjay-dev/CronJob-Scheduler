import type { Request, Response, NextFunction } from "express";
import sendEmail from "../lib/sendEmail";

export const handleHomeRoute = (req: Request, res: Response, next: NextFunction): void => {
  res.status(200).send("Hey from email service");
}

export const handleSendEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  
  const { name, email, template, data} = req.body;

  try {
    await sendEmail({ name, email, template, data});
    res.status(200).json({message: 'Email sent', body: {name, email, template, data}});
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
}
