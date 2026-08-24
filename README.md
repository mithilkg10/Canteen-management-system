# JK Catering ERM Platform

A full stack Enterprise Resource Management platform built to modernize canteen and catering operations while providing a modular base for wider business workflows.

The project combines operational dashboards, authentication, role based access control, inventory, attendance, procurement, vendor records, and activity tracking.

## Core capabilities

* Role based authentication for Admin, Manager, and Staff users
* Business dashboard with operational metrics
* Inventory management
* Low stock monitoring
* Attendance tracking
* Vendor and procurement records
* Activity and audit views
* Prisma based persistence
* Secure password hashing with bcrypt

## Technology

* Next.js 16
* React 19
* TypeScript
* Prisma ORM
* SQLite for the current development profile
* NextAuth
* bcrypt
* Recharts
* Lucide React

## Local development

### Prerequisites

* Node.js 18 or later
* npm

### Install

```bash
git clone https://github.com/mithilkg10/Canteen-management-system.git
cd Canteen-management-system
npm install
```

### Database

```bash
npx prisma generate
npx prisma db push
```

Optional demonstration data can be created with the project seed scripts.

```bash
npx ts-node src/scripts/seed.ts
npx ts-node src/scripts/seed-phase2.ts
npx ts-node src/scripts/seed-phase3.ts
```

### Start

```bash
npm run dev
```

## Security model

The current application uses NextAuth, bcrypt password hashing, route protection, and role based restrictions.

The project should be treated as an engineering application rather than a claim of independent security certification. A production deployment should also provide automated authorization tests, production secret management, TLS, database backups, monitoring, rate limiting, and deployment hardening.

## Repository hygiene

Development database files should not be committed. The Prisma schema, migrations, and seed workflows should be the reproducible source for local database creation.

## Project status

Active business application and engineering project.
