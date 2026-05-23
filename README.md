# VedaAI – AI Assessment Creator

## Architecture

```
[Browser] ←→ [Next.js Frontend] ←→ [Express API]
                                         ↓
                                    [BullMQ Queue]
                                         ↓
                                    [Worker: OpenAI]
                                         ↓
                                    [MongoDB]
                                         ↓
                               [WebSocket → Browser]
```

## Stack

| Layer     | Tech                              |
|-----------|-----------------------------------|
| Frontend  | Next.js 14, TypeScript, Tailwind  |
| State     | Zustand                           |
| Backend   | Express, TypeScript               |
| Database  | MongoDB (Mongoose)                |
| Queue     | BullMQ + Redis                    |
| Realtime  | WebSocket (ws)                    |
| AI        | OpenAI gpt-4o-mini                |

## Setup

### Prerequisites
- Node 20+
- MongoDB Atlas account
- Redis (local or Upstash)
- OpenAI API key

### Run locally

```bash
# Backend
cd backend
cp .env.example .env   # fill in your values
npm install
npm run dev

# Frontend (separate terminal)
cd frontend
cp .env.example .env.local   # fill in your values
npm install
npm run dev
```

## API Reference

| Method | Path                              | Description                    |
|--------|-----------------------------------|--------------------------------|
| POST   | /api/assignments                  | Create assignment + queue job  |
| GET    | /api/assignments                  | List all assignments           |
| GET    | /api/assignments/:id              | Get single assignment          |
| DELETE | /api/assignments/:id              | Delete assignment              |
| GET    | /api/assignments/:id/result       | Fetch generated paper          |
| POST   | /api/assignments/:id/regenerate   | Re-run AI generation           |

## How it works

1. Teacher fills the form and submits. Frontend POSTs to `/api/assignments`.
2. API saves to MongoDB and adds a job to BullMQ queue.
3. Worker picks the job, calls OpenAI, parses structured JSON.
4. Result saved to MongoDB, WebSocket notifies the browser.
5. Browser navigates to the output page and renders the formatted paper.
