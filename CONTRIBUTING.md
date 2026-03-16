# Contributing to CronJob-Scheduler

First off, thank you for considering contributing to CronJob-Scheduler! It's people like you that make this tool better for everyone.

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owner of this repository before making a change.

---

## Development Setup

The project is structured as a monorepo with separate services.

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [pnpm](https://pnpm.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [MongoDB](https://www.mongodb.com/)

### Installation

1. **Clone the repo:**

   ```bash
   git clone https://github.com/sunjay-dev/CronJob-Scheduler.git
   cd CronJob-Scheduler
   ```

2. **Backend Setup:**

   ```bash
   cd backend
   pnpm install
   cp .env.example .env
   pnpm run dev
   ```

3. **Frontend Setup:**

   ```bash
   cd ../Frontend
   pnpm install
   pnpm run dev
   ```

4. **Job Runner Setup:**

   ```bash
   cd ../job-runner
   pnpm install
   cp .env.example .env
   pnpm run dev
   ```

5. **Email Service Setup:**
   ```bash
   cd ../email-service
   pnpm install
   cp .env.example .env
   pnpm run dev
   ```

---

## Pull Request Process

1. **Setup & Cleanliness**: Ensure any install or build dependencies are removed before finishing a build.
2. **Documentation**: Update the `README.md` with details of changes to the interface, including new environment variables, exposed ports, or configuration changes.
3. **Approval**: You may request a review for your Pull Request, and once approved, it will be merged into the main branch.

---

## Code of Conduct

### Our Pledge

We as contributors and the maintainer pledge to making participation in our project and our community a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language.
- Being respectful of differing viewpoints and experiences.
- Gracefully accepting constructive criticism.
- Focusing on what is best for the community.
- Showing empathy towards other community members.

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project lead at `hello@sunjay.xyz`. All complaints will be reviewed and investigated.

---

## Need Help?

If you have any questions, feel free to open an issue or reach out to the project owner.

_This Code of Conduct is adapted from the [Contributor Covenant](http://contributor-covenant.org/version/1/4), version 1.4._
