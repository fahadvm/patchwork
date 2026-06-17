# Patchwork — Issue Management Platform with AI Analysis

Patchwork is a full-stack, TypeScript-based Issue Management Platform. Users can create, browse, discuss issues, and leverage Gemini AI to perform structured analyses on issues and their associated comments (covering summary, themes, key next steps, and sentiment).

The project consists of a **NestJS** backend utilizing **Drizzle ORM** (PostgreSQL) and a **Next.js App Router** frontend styled with **TailwindCSS**.

---

## Technical Stack

- **Backend:** NestJS (v11+), Node.js, TypeScript
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **AI Engine:** Google Gemini SDK (`gemini-1.5-flash` model)
- **Frontend:** Next.js (v16 App Router), React 19, TypeScript
- **Styling:** TailwindCSS (v4)

---

## Project Structure

```
/
├── backend/               # NestJS application
│   ├── src/
│   │   ├── common/        # NestJS Interceptors & Filters
│   │   ├── database/      # Drizzle schema, migrations, seed, database module
│   │   ├── issues/        # Issues module (controller, service, DTOs)
│   │   ├── comments/      # Comments module (controller, service, DTOs)
│   │   └── ai/            # Gemini integration module (controller, service)
│   ├── drizzle.config.ts  # Drizzle Kit migration configuration
│   └── package.json
│
├── frontend/              # Next.js App Router application
│   ├── app/               # Next.js pages & styling
│   │   ├── page.tsx       # Issue dashboard list
│   │   ├── issues/
│   │   │   ├── new/       # Create issue page
│   │   │   └── [id]/      # Issue details, comments thread, & AI report
│   └── lib/
│       └── api.ts         # Typed fetch API client
│
├── docker-compose.yml     # Multi-container orchestration
└── README.md
```

---

## Environment Variables

### Backend (`/backend/.env`)
Create a `.env` file in the `backend/` directory:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/issues_db
PORT=3001
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
```
> **Note:** If `GEMINI_API_KEY` is not provided, the backend falls back to a **Mock structured analysis** automatically so that you can run and test the application without a valid Google Gemini key.

### Frontend (`/frontend/.env.local`)
Create a `.env.local` file in the `frontend/` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Step-by-Step Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or v20.x recommended)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (optional, if running PostgreSQL via docker compose)
- A running PostgreSQL database (if running locally without Docker)

---

### Step 1: Database Setup

If you have Docker running, you can spin up PostgreSQL in the background:
```bash
docker compose up -d db
```
Otherwise, ensure you have a local PostgreSQL instance running and modify the `DATABASE_URL` in `backend/.env` to point to it (creating a database named `issues_db`).

---

### Step 2: Backend Setup & Seed

1. Navigate to the backend folder and install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Generate the migrations from the schema definition:
   ```bash
   npm run db:generate
   ```
3. Run migrations to apply tables to PostgreSQL:
   ```bash
   npm run db:migrate
   ```
4. Seed the database with 5 sample issues and comments:
   ```bash
   npm run db:seed
   ```
5. Start the backend development server:
   ```bash
   npm run start:dev
   ```

The backend server will run on [http://localhost:3001](http://localhost:3001).
- Interactive Swagger docs will be available at [http://localhost:3001/api/docs](http://localhost:3001/api/docs).

---

### Step 3: Frontend Setup

1. Navigate to the frontend directory and install dependencies:
   ```bash
   cd ../frontend
   npm install
   ```
2. Start the Next.js development server:
   ```bash
   npm run dev
   ```

The frontend application will be active at [http://localhost:3000](http://localhost:3000).

---

## Running with Docker Compose

To spin up PostgreSQL, the NestJS Backend, and the Next.js Frontend all together, run this command from the root directory:

```bash
docker compose up --build
```
This commands builds the backend and frontend containers, connects them, and exposes:
- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend:** [http://localhost:3001](http://localhost:3001)

---

## Deployment Links (Placeholders)

- **Frontend URL:** `https://patchwork-issue-tracker.vercel.app`
- **Backend API URL:** `https://api.patchwork-tracker.com`

---

## AI Analysis Mechanism

When a user clicks "Analyze with Gemini" on an issue detail page:
1. The backend triggers a structured request using the `@google/generative-ai` SDK.
2. The prompt aggregates the **Issue Title**, **Description**, and all **Comment Thread history**.
3. It uses `gemini-1.5-flash` to return a structured JSON response mapping out a concise **Summary**, **Key Themes**, **Sentiment analysis**, and **Suggested Next Steps**.
4. The result is saved in the `ai_analyses` table and rendered in a modern highlighted panel on the frontend.
