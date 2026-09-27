# ⚡ TaskFlow — Modern Small Business Workflow Management SaaS

> **Work organized. Business simplified.**  
> A high-performance, polished, and responsive digital workflow management platform built specifically for small businesses to replace scattered WhatsApp messages, physical notebooks, phone calls, and spreadsheets.

[![React](https://img.shields.io/badge/React-18.2-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.2-purple?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📌 Executive Summary & UX Principle

Small business owners frequently lose revenue, delay deliveries, and suffer customer churn because daily operational tasks are spread across WhatsApp groups, paper memos, phone calls, and memory.

**TaskFlow** operates on one core UX principle:  
> *"Know what needs to be done, who is responsible, and what needs immediate attention."*

---

## ✨ Key Features & Capabilities

### 1. Executive Dashboard
- **Live Business KPIs**: Real-time cards for **Total Tasks**, **In Progress**, **Completed**, and **Overdue Items** with percentage trends.
- **Today's Focus**: Visual workload distribution progress bar and real-time status breakdowns (Overdue, Due Today, In Progress, Completed).
- **Urgent Attention Card**: Automatic detection and spotlighting of the most pressing overdue or high-priority items with a 1-click **"View Task"** side-panel trigger.
- **Recent Tasks**: Interactive table with inline status toggling and row previews.

### 2. Workflows & Tasks (Table & Kanban Board Views)
- **Dual View Modes**:
  - **Table View**: Detailed list with assignees, priority indicators, relative deadlines, and status badges.
  - **Kanban Board View**: Visual columns (*To Do*, *In Progress*, *Completed*) with real-time counters and "+ Add" triggers.
- **Live Search & Multi-Filters**: Instant client/title search, status tab pills with counts, priority dropdowns (*High, Med, Low*), assignee filters, and sorting (*Due Date, Priority, Title*).
- **Task Details Slide-Over Drawer**: Linear-inspired side preview panel with:
  - 3-step workflow status stepper (*To Do → In Progress → Completed*).
  - Relative time countdowns and overdue alert banners.
  - Assignee card with avatars, creation timestamp, and quick complete actions.

### 3. Quick Task Modal
- Preset deadlines (*"Today 5 PM"*, *"Tomorrow"*, *"+3 Days"*).
- Visual priority pills (*Low, Med, High*).
- Team assignment selector.
- Keyboard shortcuts: `Esc` to cancel, `Ctrl/Cmd + Enter` to submit.

### 4. Team Workload Management
- Staff cards featuring custom avatar initials, roles, and real-time workload metrics (*Total Tasks, Completed, Pending*).
- Dynamic completion progress bar for each employee.
- Direct contact integration with **Email** and **WhatsApp** shortcuts.
- **Add Team Member Modal** with validation.

### 5. Business Productivity Analytics
- Executive overview cards: **Completion Rate (%)**, **On-Time Delivery Rate (%)**, **Active Workflows**, and **Overdue Ratio**.
- **Donut Chart**: Real-time task status distribution using Recharts.
- **Stacked Bar Chart**: Individual employee output (*Completed vs. Pending vs. Overdue*).
- **Performance Leaderboard**: Detailed table ranking team members by turnaround efficiency.

### 6. Settings & Hackathon Demo Tools
- Company profile customization (*Business Name, Owner, GSTIN, Phone, City*).
- **"Reset to Demo Data"**: 1-click button restoring 11 realistic Indian small business tasks and 4 staff members.
- **"Download JSON Backup"**: Export full task database snapshot.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS with custom typography, elevation rings, and animations
- **Iconography**: Lucide React
- **Data Visualizations**: Recharts
- **Date Utilities**: Date-fns
- **State Management**: Reactive in-memory & LocalStorage store with clean Firebase adapter readiness

---

## 📂 Project Directory Structure

```text
TaskFlow/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI automated build workflow
├── src/
│   ├── components/
│   │   ├── Layout.tsx            # SaaS dashboard layout with sidebar & topbar
│   │   ├── TaskDetailsDrawer.tsx # Slide-over inspection drawer
│   │   ├── TaskModal.tsx         # Create / Edit task dialog with presets
│   │   └── ToastProvider.tsx     # Modern toast notifications system
│   ├── hooks/
│   │   └── useData.ts            # Custom React hooks for tasks & team members
│   ├── pages/
│   │   ├── Analytics.tsx         # Business charts & leaderboard
│   │   ├── Dashboard.tsx         # KPI cards, Today's Focus, and Recent Tasks
│   │   ├── Settings.tsx          # Company profile & demo data controls
│   │   ├── Tasks.tsx              # Dual view (Table / Kanban) & multi-filters
│   │   └── Team.tsx               # Employee workload cards & add member modal
│   ├── services/
│   │   └── store.ts              # Reactive data store with auto-overdue engine
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces for Task & TeamMember
│   ├── utils/
│   │   └── cn.ts                 # Classname utility
│   ├── App.tsx                   # Routing configuration
│   ├── index.css                 # Tailwind base styles
│   └── main.tsx                  # Application entrypoint
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/TaskFlow.git
   cd TaskFlow
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```text
   http://localhost:5173 (or http://localhost:5174)
   ```

---

## 📦 Building for Production

To create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
