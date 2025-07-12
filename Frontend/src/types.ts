export interface JobDetails {
 name: string,
    url: string,
    method: string,
    cron: string,
    headers: string,
    body: string,
    enabled: boolean,
    timezone? : string
}