export interface JobDetails {
  name: string,
  url: string,
  method: string,
  cron: string,
  headers: string,
  body: string,
  enabled: boolean,
  timezone?: string
}

export interface JobInterface {
  _id: string;
  name: string;
  type: string;
  priority: number;
  disabled: boolean;
  repeatInterval: string;
  repeatTimezone: string;
  nextRunAt: string;
  lastRunAt: string;
  lastFinishedAt: string;
  lockedAt: string | null;
  startDate: string | null;
  endDate: string | null;
  skipDays: string | null;
  shouldSaveResult: boolean;
  lastModifiedBy: string | null;
  userId: string;

  data: {
    name: string;
    url: string;
    method: string;
    headers: Record<string, string>;
  };
}


export interface UserLogInterface {
  _id: string;
  createdAt: string;
  url: string;
  method: string;
  status: "success" | "failed";
  jobId:string;
  name:string;
  statusCode?: string;
  responseTime: {
    DNS: number,
    Connect: number,
    SSL: number,
    Send: number,
    Wait: number,
    Receive: number,
    Total: number
  }
}

export interface User {
  name: string;
  email: string;
  timezone: string;
  mode: "day" | "dark";
  timeFormat24: boolean;
  emailNotifications: boolean;
  pushAlerts: boolean;
}

export interface JobResponse {
  type: "success" | "error";
  message: string
}