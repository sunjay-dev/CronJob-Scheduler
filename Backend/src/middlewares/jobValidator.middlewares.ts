import validator from 'validator';
import { isValidCron } from 'cron-validator';
import { Request,Response,NextFunction } from 'express';

export function jobValidatorMiddleware(req:Request, res:Response, next:NextFunction): void {

  const { name, url, method, headers, cron, timezone, enabled } = req.body;

  if (!name || !url || !method || !cron || !timezone || enabled === undefined) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  if (typeof url !== 'string' || !validator.isURL(url, { protocols: ['http', 'https'], require_protocol: true })) {
    res.status(400).json({ message: "Please enter a valid URL" });
    return;
  }

  if (typeof cron !== 'string' || !isValidCron(cron, { seconds: true })) {
    res.status(400).json({ message: "Invalid cron expression" });
    return;
  }

  if (typeof method !== 'string' || !['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'CONNECT', 'PATCH', 'TRACE'].includes(method.toUpperCase())) {
    res.status(400).json({ message: "Invalid method type" });
    return;
  }

  if (typeof timezone !== 'string') {
    res.status(400).json({ message: "Timezone must be a string" });
    return;
  }

  if (typeof enabled !== 'boolean') {
    res.status(400).json({ message: "Enabled must be a boolean" });
    return;
  }

  if (!Array.isArray(headers)) {
    res.status(400).json({ message: "Headers must be an array" });
    return
  }

  for (const h of headers) {
    if (typeof h.key !== 'string' || typeof h.value !== 'string') {
      res.status(400).json({ message: "Each header key and value must be a string" });
      return;
    }
  }

  next();
}
