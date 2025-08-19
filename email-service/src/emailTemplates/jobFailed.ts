interface Props {
  name: string | null;
  jobName: string | null;
  method: string | null;
  url: string | null;
  lastRunAt: string | null;
  error: string | null;
}
export default function jobFailedTemplate({ name, jobName, method, url, lastRunAt, error }: Props) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Job Failure Notification</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 30px 15px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td align="center" style="background-color: #8b5cf6; padding: 20px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Job Failed Notification</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 25px;">
              <p style="font-size: 16px; color: #333333; margin-bottom: 20px;">
                Hello <strong>${name}</strong>,  
                <br/><br/>
                One of your scheduled jobs has failed multiple times. Below are the details:
              </p>

              <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse: collapse; margin-bottom: 20px;">
                <tr style="background-color: #f3e8ff;">
                  <td style="border: 1px solid #e2e8f0;"><strong>Job Name</strong></td>
                  <td style="border: 1px solid #e2e8f0;">${jobName || "Unknown Job"}</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #e2e8f0;"><strong>Job url</strong></td>
                  <td style="border: 1px solid #e2e8f0;">${url || "N/A"}</td>
                </tr>
                <tr style="background-color: #f3e8ff;">
                  <td style="border: 1px solid #e2e8f0;"><strong>Method</strong></td>
                  <td style="border: 1px solid #e2e8f0;">${method  || "N/A"}</td>
                </tr>
                <tr>
                <td style="border: 1px solid #e2e8f0;"><strong>Error</strong></td>
                <td style="border: 1px solid #e2e8f0;">${error || "Unknown error"}</td>
                </tr>
                <tr style="background-color: #f3e8ff;">
                  <td style="border: 1px solid #e2e8f0;"><strong>Last Run At</strong></td>
                  <td style="border: 1px solid #e2e8f0;">${lastRunAt? new Date(lastRunAt).toUTCString().replace("GMT", "UTC"): "N/A"}</td>
                </tr>
              </table>

              <p style="font-size: 13px; color: #777; margin-top: -10px; margin-bottom: 20px;">
                <em>Note: All timestamps are shown in UTC.</em>
              </p>
              
              <p style="font-size: 15px; color: #444444; margin-bottom: 20px;">
                Please review your job configuration or API endpoint.  
                If this continues, the job will remain disabled until you fix the issue.
              </p>

              <div style="text-align: center; margin-top: 30px;">
                <a href="https://cronjon.site/" target="_blank" 
                   style="background-color: #8b5cf6; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 16px;">
                   View Job in Dashboard
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background: #f3f4f6; padding: 15px; font-size: 12px; color: #666666;">
              © ${lastRunAt? new Date(lastRunAt).getFullYear(): "2025"} cronJob schedular. All rights reserved.<br/>
              You are receiving this email because you have a scheduled job on cronJob schedular.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}