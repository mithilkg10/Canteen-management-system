# JK Catering ERM Platform 🚀

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite)

A comprehensive, scalable, and highly secure digital Enterprise Resource Management (ERM) platform built initially to modernize and streamline canteen operations. This project serves as a modular, cloud-integrated foundation designed to scale and support various other business operations.

## 🌟 Key Features

- **Advanced Role-Based Authentication:** Secure login architecture implemented via `next-auth`, ensuring different access levels for Admin, Manager, and Staff.
- **Real-Time Data Dashboard:** High-end, dynamic data visualizations using `recharts` to track business metrics, including:
  - Daily Revenue vs Estimated Profit (Bar Charts)
  - Procurement Spending Trends (Area Charts)
  - Live Meal Demand Breakdowns (Donut Charts)
  - Critical Stock Level Monitoring (Radial Progress Bars)
- **Live System Activity Feed:** Continuous real-time feed tracking all backend system actions, modifications, and security events for complete organizational accountability.
- **Inventory Management Module:** Track real-time stock levels, automated low-stock warnings, and historical pricing per unit.
- **Attendance Tracking:** Integrated check-in and check-out tracking for all employees.
- **Vendor & Procurement CRM:** End-to-end logging of all B2B transactions and supply chain history.

## 💻 Tech Stack

- **Frontend:** Next.js 16 (App Router), React 18, HTML5, Vanilla CSS (Custom Glassmorphism Design System), Lucide React (Icons)
- **Backend:** Node.js, Next.js Server Actions / API Routes
- **Database & ORM:** SQLite, Prisma ORM
- **Authentication:** NextAuth.js with secure bcrypt password hashing
- **Data Visualization:** Recharts

## 🎨 UI/UX Design

The application features a bespoke **Premium Enterprise Design System** shifting away from generic templates. It utilizes:
- A sophisticated Onyx, Charcoal, and Rich Amber color palette.
- High-quality abstract mesh backgrounds.
- Modern glassmorphism UI elements with custom micro-animations and seamless transitions.

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v18+) and npm installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/canteen-management-system.git
   cd canteen-management-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup the database and generate Prisma Client:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Run the seed script to populate mock data (Optional):
   ```bash
   npx ts-node src/scripts/seed.ts
   npx ts-node src/scripts/seed-phase2.ts
   npx ts-node src/scripts/seed-phase3.ts
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛡️ Security
This project prioritizes security by implementing route-level protection, secure session cookies, IP tracking on failed login attempts, and strict backend validation for all Prisma queries.
