export interface GetLogsParams {
  userId: string;
  jobId?: string;
  page?: number;
  limit?: number;
  status?: string;
  method?: string;
}
