# MATCOLLEGE-WIL

A Nuxt 4 + Vue 3 platform for managing Teaching Practice (TP) assessments at Madziwa College. The application helps supervisors record student assessments, manage departments and districts, generate PDF reports, and support offline assessments in the field.

## Overview

MATCOLLEGE-WIL is designed for college staff and supervisors to:

- create and manage assessments
- track student and supervisor records
- support district-based reporting
- export assessment results as PDF/ZIP files
- work offline when internet access is unreliable
- manage secure admin and supervisor access

## Tech Stack

- Frontend: Nuxt 4, Vue 3, PrimeVue 4
- Styling: Tailwind CSS 3
- Backend: Nuxt server routes / Nitro
- Database: MySQL
- ORM: Prisma 6
- PDF generation: Puppeteer
- ZIP export: JSZip
- Runtime: Node.js

## Features

- Multi-level assessment support
- Supervisor and student management
- District-based access and reporting
- Assessment scoring and validation
- PDF export for individual assessments
- Batch ZIP export for multiple assessments
- Offline-capable PWA experience
- Admin dashboard with summary statistics
- Responsive UI for desktop and mobile devices

## Prerequisites

Before running the app, make sure you have:

- Node.js 18 or newer
- npm
- MySQL running locally (for example via XAMPP)
- Git

## Quick Start

### 1) Clone the repository

```bash
git clone https://github.com/Manuhwa/MATCOLLEGE-WIL.git
cd MATCOLLEGE-WIL
```

### 2) Install dependencies

```bash
npm install
```

### 3) Configure the database

Start MySQL and create a database such as `madziwa_tp`.

Create a `.env` file in the project root:

```env
DATABASE_URL="mysql://root:@localhost:3306/madziwa_tp"
NODE_ENV="development"
```

If your MySQL credentials differ, update the connection string accordingly.

### 4) Generate Prisma client and push the schema

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 5) Start the app

```bash
npm run dev
```

Open the application in your browser at:

```text
http://localhost:3000
```

## Available Scripts

```bash
# Development
npm run dev
npm run build
npm run preview

# Database
npm run db:generate
npm run db:push
npm run db:migrate
npm run db:studio
npm run db:seed
```

## Admin Access

The app includes an admin login flow for managing the system.

- URL: `/admin`
- Username: `admin`
- Password: `admin123`

## Offline Support

The platform includes offline functionality for supervisors working in areas with poor connectivity:

- assessment forms can be queued and synced later
- student lookup data can be cached locally
- the app can behave as a PWA for faster access on supported devices

## Project Structure

```text
MATCOLLEGE-WIL/
├── assets/
├── components/
├── layouts/
├── middleware/
├── pages/
├── prisma/
├── server/
├── scripts/
├── public/
├── nuxt.config.ts
├── package.json
├── tailwind.config.js
├── README.md
├── .env.example (if present)
└── .gitignore
```

## Database Notes

This project uses Prisma with a MySQL database. If you want to inspect the schema or data model, see the Prisma files under `prisma/`.

## Deployment

For production builds:

```bash
npm run build
npm run preview
```

You can also run the app with a process manager such as PM2 if needed.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your fork
5. Open a pull request

## License

This project is licensed under the MIT License unless otherwise stated in the repository.

## Support

For support or questions regarding setup and usage, contact the project owner or repository maintainer.

---

Built for Madziwa College Teaching Practice assessment workflows.
