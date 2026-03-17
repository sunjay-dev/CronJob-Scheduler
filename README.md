# CronJob-Scheduler

<img src="https://raw.githubusercontent.com/sunjay-dev/CronJob-Scheduler/refs/heads/main/assets/preview.webp" alt="CronJob image" width="100%" />

A simple yet powerful cron job scheduler to automate recurring API requests (GET/POST) using
[Agenda.js](https://github.com/agenda/agenda). Schedule jobs, view logs, and control execution — all from a modern web
dashboard.

---

## 🚀 Features

- 🕒 Schedule recurring jobs using cron expressions
- 📡 Supports GET, POST and many other requests options with custom headers/body
- 🧠 Built on **Agenda.js** for robust background processing
- 📊 View job execution logs and status (success/failure)
- ✨ Toggle jobs on/off without deleting them
- 💻 Clean React + Tailwind
- 🔐 JWT-based authentication
- ⚡ Dedicated **Job Runner** for background execution
- 📈 Real-time monitoring with Prometheus + Grafana

---

## 🛠️ Tech Stack

![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4.svg?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Chart.js](https://img.shields.io/badge/chart.js-F5788D.svg?style=for-the-badge&logo=chart.js&logoColor=white)
![Lucide-React](https://img.shields.io/badge/Lucide--React-000000.svg?style=for-the-badge&logo=lucide&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Redux-toolKit](https://img.shields.io/badge/redux_toolkit-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![Agenda.js](https://img.shields.io/badge/Agenda.js-%23ef4444.svg?style=for-the-badge&logo=nodedotjs&logoColor=white)
![PNPM](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220)
![Passport.js](https://img.shields.io/badge/Passport.js-000000.svg?style=for-the-badge&logo=passport&logoColor=00ff99)
![Resend](https://img.shields.io/badge/Resend-000000.svg?style=for-the-badge&logo=resend&logoColor=fff)
![Zod](https://img.shields.io/badge/Zod-7C3AED.svg?style=for-the-badge&logo=zod&logoColor=white)
![Upstash](https://img.shields.io/badge/Qstash-10B981.svg?style=for-the-badge&logo=upstash&logoColor=white)
![Pino](https://img.shields.io/badge/Pino-4B9E5F.svg?style=for-the-badge&logo=pino&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED.svg?style=for-the-badge&logo=docker&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-%23DC382D.svg?style=for-the-badge&logo=redis&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-%23EC5990.svg?style=for-the-badge&logo=reacthookform&logoColor=white)
![Grafana](https://img.shields.io/badge/Grafana-%23F46800.svg?style=for-the-badge&logo=grafana&logoColor=white)
![Prometheus](https://img.shields.io/badge/Prometheus-%23E6522C.svg?style=for-the-badge&logo=prometheus&logoColor=white)

---

## 🏗️ Current Architecture

<img src="https://raw.githubusercontent.com/sunjay-dev/CronJob-Scheduler/refs/heads/main/assets/architecture.webp" alt="CronJob architecture Image" width="100%" />

## 📦 Installation

> ⚠️ Before you start, make sure you have the following installed:
>
> - [pnpm](https://pnpm.io/installation) (package manager used in this project)
> - [TypeScript](https://www.typescriptlang.org/download) (`tsc` compiler)

### 1. Clone the repository

```bash
git clone https://github.com/sunjay-dev/CronJob-Scheduler.git
cd CronJob-Scheduler
```

### 2. Setup Backend (Required)

```bash
cd Backend
pnpm install
cp .env.example .env
# Update .env with your MongoDB URI (Other fields are optional until you're testing them)

pnpm run dev
```

### 3. Setup Frontend (Required)

```bash
cd Frontend
pnpm install

# Update VITE_BACKEND_URL in .env (defaults to http://localhost:3000)

pnpm run dev
```

### 4. Setup Job Runner

> ⚡ Required for actual scheduling

```bash
cd job-runner
pnpm install
cp .env.example .env
# Make sure the MongoDB URI matches the backend
pnpm run dev
```

### 4. Setup Email Service (Optional)

> ⚡ Only needed if you want to test/run email service.

```bash
cd email-service
pnpm install
cp .env.example .env
# Update .env with your RESEND_EMAIL_API_KEY, SENDEREMAIL, and EMAIL_SERVICE_SECRET

pnpm run dev
```

---

## 🖥️ Folder Structure

```
CronJob-Scheduler/
├── backend/        # Server (Express + Agenda.js)
├── frontend/       # Client (React + Tailwind)
├── job-runner/     # Background worker (Agenda.js)
├── email-service/  # Email microservice (Express + Resend)
├── docker-compose.yml # Docker Compose file
├── .prettierrc # Prettier configuration
├── .gitignore # Git ignore file
├── README.md
```

---

## 🧭 Roadmap

- <del> Create/Update/Delete jobs</del>
- <del> Job toggle (enable/disable)</del>
- <del> Execution logs viewer</del>
- <del> Support for All http requests methods</del>
- <del> User account settings <del>
- <del> Google login config <del>
- <del> Forget password <del>
- <del> Email notifications on failure <del>
- <del> Retry on failure + backoff strategy <del>
- <del> Monitoring with Prometheus + Grafana <del>
- Convert to Micro-service architecture

## 🤝 Contributing

Contributions, suggestions, and improvements are always welcome!
