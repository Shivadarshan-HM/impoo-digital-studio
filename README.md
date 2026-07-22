# IMPO Digital Studio

Multi-project monorepo structure with independent sub-projects for website, admin panel, and backend services.

## Directory Structure

```text
IMPO-Digital-Studio/
├── website/   # Public Next.js Website (Port 3000)
├── admin/     # Admin Panel Next.js Web App (Port 3001)
└── backend/   # FastAPI Backend API (Future phase)
```

Each directory is completely self-contained with its own `package.json`, `node_modules`, and configuration files.

---

## Getting Started & Local Development

### Running the Public Website

```bash
cd website
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Running the Admin Panel

```bash
cd admin
npm install
npm run dev
```
Open [http://localhost:3001](http://localhost:3001) in your browser.

---

### Running Both Simultaneously

Run each project in a separate terminal window:

**Terminal 1 (Public Website):**
```bash
cd website && npm run dev
```

**Terminal 2 (Admin Panel):**
```bash
cd admin && npm run dev
```

---

### Backend (FastAPI)

```bash
cd backend
# Backend setup will be implemented in future phase
```
