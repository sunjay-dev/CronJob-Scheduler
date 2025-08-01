# CronJob-Scheduler

<img src="https://raw.githubusercontent.com/sunjay-dev/CronJob-Scheduler/refs/heads/main/assets/preview.webp" alt="CronJob image" width="100%" />

A simple yet powerful cron job scheduler to automate recurring API requests (GET/POST) using [Agenda.js](https://github.com/agenda/agenda). Schedule jobs, view logs, and control execution — all from a modern web dashboard.

---

## 🚀 Features

- 🕒 Schedule recurring jobs using cron expressions
- 📡 Supports GET, POST and many other requests options with custom headers/body
- 🧠 Built on **Agenda.js** for robust background processing
- 📊 View job execution logs and status (success/failure)
- ✨ Toggle jobs on/off without deleting them
- 💻 Clean React + Tailwind dashboard
- 🔐 JWT-based authentication

---

## 🛠️ Tech Stack

![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) 
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) 
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) 
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4.svg?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Chart.js](https://img.shields.io/badge/chart.js-F5788D.svg?style=for-the-badge&logo=chart.js&logoColor=white) 
![Lucide-React](https://img.shields.io/badge/Lucide--React-000000.svg?style=for-the-badge&logo=lucide&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![Agenda.js](https://img.shields.io/badge/Agenda.js-%23ef4444.svg?style=for-the-badge&logo=nodedotjs&logoColor=white)
![PNPM](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220)
![Passport.js](https://img.shields.io/badge/Passport.js-000000.svg?style=for-the-badge&logo=passport&logoColor=00ff99)

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/sunjay-dev/CronJob-Scheduler.git
cd CronJob-Scheduler
````

### 2. Setup Backend

```bash
cd server
pnpm install
cp .env.example .env
# Update .env with your MongoDB URI and JWT secret

pnpm run dev
```

### 3. Setup Frontend

```bash
cd ../client
pnpm install
pnpm run dev
```

---

## 🧪 Environment Variables

Example `.env` file for backend:

```env
PORT=5000
MONGO_URI=YOUR_MONGO_URI
MONGO_DB_COLLECTION=agendaJobs
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

---

## 🖥️ Folder Structure

```
CronJob-Scheduler/
├── Backend/     # Server (Express + Agenda.js)
├── Frontend/    # Client (React + Tailwind)
├── README.md       
```

---

## 🧭 Roadmap

* <del> Create/Update/Delete jobs</del>
* <del> Job toggle (enable/disable)</del>
* <del> Execution logs viewer</del>
* <del> User account settings <del>
* <del> Google login configed <del>
* [ ] Email notifications on failure
* [ ] Support for PUT/DELETE requests
* [ ] Retry on failure + backoff strategy

## 🤝 Contributing

Contributions, suggestions, and improvements are always welcome!