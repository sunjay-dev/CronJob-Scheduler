import { BadRequestError } from "./appError.utils.js";

export function getHeaderObj(headers: { key: string; value: string }[]) {
  return headers.reduce(
    (acc, { key, value }) => {
      const trimmedKey = key?.trim();
      const trimmedValue = value?.trim();

      if (trimmedKey && trimmedValue) acc[trimmedKey] = trimmedValue;
      return acc;
    },
    {} as Record<string, string>,
  );
}

export function processJobBody(body: string, method: string, headersObj: Record<string, string>) {
  if (body && body.trim() !== "") {
    const allowedMethods = ["POST", "PUT", "PATCH"];

    if (!allowedMethods.includes(method.toUpperCase())) {
      throw new BadRequestError(`Method ${method} should not include a body.`);
    }

    const contentType = headersObj["Content-Type"] || headersObj["content-type"];

    if (contentType === "application/json") {
      try {
        JSON.parse(body);
      } catch {
        throw new BadRequestError("Invalid JSON in body.");
      }
    }

    return body.trim();
  }
  return "";
}

export const isValidTimezone = (timezone: string): boolean => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
};
