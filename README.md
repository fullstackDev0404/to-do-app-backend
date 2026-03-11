# TodoPro – Backend

Node.js + Express API for TodoPro (auth, todos, MongoDB).

## Commands

| Command | Description |
|--------|-------------|
| `npm install` | Install dependencies |
| `npm start` or `npm run dev` | Run server (with nodemon for dev) |
| `npm test` | Placeholder – no tests configured |

## Setup

1. Install: `npm install`
2. Copy `.env.example` to `.env` and set:
   - `JWT_SECRET` – secret for signing tokens
   - `MONGODB_URI` – MongoDB connection string (default: `mongodb://localhost:27017/todo_app_full`)
   - `CLIENT_URL` – frontend origin for CORS (default: `http://localhost:3000`)
   - `PORT` – server port (default: `5000`)
3. Ensure MongoDB is running, then: `npm start` or `npm run dev`

Server runs at [http://localhost:5000](http://localhost:5000) by default. API base: `/api` (e.g. `/api/auth/login`, `/api/todos/get`).

## Tech

- Node.js, Express 5, Mongoose, JWT, bcryptjs, CORS, dotenv.