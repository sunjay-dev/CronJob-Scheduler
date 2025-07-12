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

export interface JobInterface {
  data : {
    url: string;
    name: string;
    method:string;
  }
  _id:string
  nextRunAt:string;
  disabled? :boolean
}

export interface UserLogInterface {
    _id: string;
    createdAt: string;
    url:string;
    method: string;
    status: "success" | "failed";
}
