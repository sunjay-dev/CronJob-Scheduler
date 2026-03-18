export interface JobPayload {
  name: string;
  url: string;
  method: string;
  headers: Record<string, string | undefined>;
  userId: string;
  timeout?: number;
  email?: string;
  body?: string;
  errorCount?: number;
}
