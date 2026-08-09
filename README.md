# TaskSync

A collaborative project management platform built as a capstone project to learn React, Node.js/Express, and PostgreSQL by actually building something real.

## Tech Stack

**Frontend:** React (Vite SPA)
**Backend:** Node.js, Express
**Database:** PostgreSQL (`pg` library)
**Auth:** JWT stored in HttpOnly cookies, passwords hashed with bcrypt

## Project Structure

```
TaskSync/
├── Backend/
│   ├── app.js              # Express app setup (CORS, cookies, routes)
│   ├── server.js           # Entry point — inits DB, starts server
│   ├── db/
│   │   ├── index.js        # PG connection pool + parameterized query helper
│   │   └── init.js         # Creates tables if they don't exist
│   ├── routes/              # Route definitions (auth, projects, tasks)
│   ├── controllers/         # Request/response handling
│   ├── services/            # Business logic + DB queries
│   ├── middleware/
│   │   └── auth.js         # JWT verification, project membership checks
│   └── utils/
│       ├── jwt.js          # Sign/verify tokens, set/clear auth cookie
│       └── password.js     # bcrypt hash/compare
└── Frontend/
    └── src/                # React + Vite app
```

## Features

### Core
- User registration and login with hashed passwords and JWT session cookies
- Projects with owner/admin/member roles
- Task creation, listing, and updates scoped to a project
- Activity feed logging key events (task created, moved, assigned, member invited)

### Custom features (scoped for this capstone)
- **Task Metadata** — priority levels (`low` / `medium` / `high` / `urgent`) and due dates on every task
- **Search & Filter** — tasks can be filtered by status, priority, assignee, or searched by title/description
- **Task Detail Modal** *(frontend, in progress)*

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL running locally, with a database created (e.g. `tasksync`)

### Backend setup

```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/`:

```env
JWT_SECRET=your-secret-here
JWT_EXPIRES_IN=7d

PORT=3000
NODE_ENV=development

PGHOST=localhost
PGPORT=5432
PGDATABASE=tasksync
PGUSER=postgres
PGPASSWORD=your-password
```

> **Note:** `PGDATABASE` must point at your actual database (e.g. `tasksync`), not the default `postgres` database — otherwise the app will silently connect to the wrong place.

Start the server:

```bash
npm start
```

On boot, `server.js` runs `initDatabase()`, which creates all tables (`users`, `projects`, `project_members`, `tasks`, `activity_logs`) if they don't already exist, then starts listening on `PORT`.

### Frontend setup

```bash
cd Frontend
npm install
npm run dev
```

The frontend is configured with `credentials: 'include'` on requests so the auth cookie set by the backend is sent on every subsequent call — this pairing with the backend's `cors({ origin: true, credentials: true })` is what makes cross-origin cookie auth work between the Vite dev server and the API.

## Database Schema (summary)

- **users** — id, username, email, password_hash, created_at
- **projects** — id, name, description, owner_id, created_at
- **project_members** — project_id, user_id, role (`admin` / `member`)
- **tasks** — id, project_id, title, description, status, priority, due_date, assigned_to, created_at
- **activity_logs** — id, project_id, user_id, action_type, description, created_at

All foreign keys cascade appropriately (e.g. deleting a project removes its members, tasks, and logs).

## Security Notes

- All SQL queries use parameterized placeholders (`$1`, `$2`, ...) rather than string interpolation, to prevent SQL injection.
- Passwords are hashed with bcrypt before storage — plaintext passwords are never persisted.
- JWTs are stored in HttpOnly cookies (inaccessible to JavaScript, mitigating XSS token theft), with `sameSite: 'lax'` and `secure` enabled in production.
- Route-level middleware (`requireAuth`, `requireProjectMember`, `requireProjectAdmin`, `requireTaskProjectMember`) enforces that users can only act on projects/tasks they're actually members of.

## Development Notes / Debugging Journey

A few real issues hit and fixed during development, kept here for the write-up:

- **Variable shadowing bug:** In `taskService.js`, a local `const query` (holding the SQL string) shadowed the imported `query` function from `db/index.js`, causing `TypeError: query is not a function` at runtime. Fixed by renaming the local SQL string variable to `sql`. A good reminder that JS doesn't warn you at compile time when a local name hides an imported one.
- **Env misconfiguration risk:** `PGDATABASE` defaulting to `postgres` instead of the project's actual `tasksync` database was flagged and corrected — a subtle bug that wouldn't throw an error, just silently query the wrong database.

## Roadmap

- [x] Backend scaffolding (Express, PostgreSQL, JWT auth)
- [x] Auth middleware and route protection
- [ ] Frontend design system (pastel/pixel-art theme)
- [ ] Auth pages (login/register)
- [ ] Kanban board view
- [ ] Task detail modal + search/filter UI
- [ ] Final polish + documentation

## Author

G Smruti Shriya
