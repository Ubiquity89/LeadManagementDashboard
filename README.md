# Smart Leads Dashboard

## Features
- JWT Authentication
- Lead CRUD
- Filters & Search
- CSV Export
- Role Based Access
- Pagination
- Dark Mode

## Tech Stack
Frontend:
- React
- TypeScript
- TailwindCSS

Backend:
- Node.js
- Express.js
- MongoDB

## Setup

### Backend
cd backend
npm install
npm run dev

### Frontend
cd frontend
npm install
npm run dev

## Environment Variables

Backend:
PORT=
MONGO_URI=
JWT_SECRET=

Frontend:
VITE_API_URL=

## API Routes

POST /api/auth/register
POST /api/auth/login

GET /api/leads
POST /api/leads
PUT /api/leads/:id
DELETE /api/leads/:id
