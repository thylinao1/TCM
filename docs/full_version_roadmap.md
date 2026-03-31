# TCM Blue Morning: MVP to Full Product Roadmap

You have successfully built a beautiful, interactive "showcase" frontend. Right now, your app relies on mock data (`src/data/mockData.ts`) and client-side routing. 

To turn this into a **fully functional, interactive application**, you need to replace the mocked systems with real databases, authentication, and backend logic. Here is a breakdown of what you need to add, divided into core phases.

---

## 1. Backend & Strategy (The "Brain")

Your main decision is where to store data (Sessions, Survey Templates, Responses). You have two primary paths based on files I see in your codebase like `google_forms_apps_script.js`:

**Path A: The Full Custom Route**
You build a complete backend to host the surveys (since you already have a `PublicSurvey` page) and store the results.
- **Database:** Set up a database like **Supabase** (PostgreSQL) or **Firebase** to store your `Session`, `SurveyTemplate`, and `SurveyResponse` types. 
- **API Engine:** Create server endpoints to handle logic. (You can use Supabase Edge Functions, or build a Node.js/Express server, or utilize Next.js/Vite SSR APIs).

**Path B: The Google Forms Hybrid**
You continue to use Google Forms for data collection but use a custom backend for the dashboard.
- **Webhooks:** Use your AppScript (`google_forms_apps_script.js`) to automatically trigger a webhook every time a user submits a Google Form.
- **Database Sync:** The webhook pushes the Google Form data into your database (e.g., Supabase), which your React dashboard then reads.

> [!TIP]
> **Decision Made**: The project will proceed with **Path A (Supabase)**, building a custom survey engine directly integrated with a PostgreSQL database and Supabase Auth.

---

## 2. Authentication & Security

Currently, anyone can view the dashboard. You need to secure it so that trainers and managers only see their assigned data.

- **Trainer Logins:** Implement an Auth provider (e.g., **Supabase Auth**). 
- **Protected Routes:** Update your React Router setup in `App.tsx` so that users must be logged in to access `/` and `/session/:id`.
- **Row-Level Security (RLS):** Ensure that a trainer can only fetch and view `Session` data where they are assigned (`trainerName` or `trainerId`).

---

## 3. Data Fetching & State Management

You need to strip out `mockData` and interact with a live database.

- **Replace Mock Imports:** Swap imports of `import { sessions } from '../data/mockData'` with actual Supabase network requests.
- **Loading & Error States:** Implement loading spinners or skeleton UI while data fetches over the network.
- **React Query (Optional but recommended):** Use a library like `@tanstack/react-query` to fetch data, cache it, and automatically update your dashboard when new surveys are completed.

---

## 4. Email Automation & Link Generation

To handle the "Pre", "End", and "30-Day Refresher" stages:

- **Link Generation:** When a `Session` is created in the database, automatically generate the unique survey URLs (e.g., `/q/{session_id}/pre`).
- **Email Triggers:** Use a service like **Resend** or **SendGrid** via Supabase Edge Functions to automatically email participants the survey links. 
- **Cron Jobs (Timed Tasks):** To send the "30-Day Refresher", you need a scheduled function (pg_cron in Supabase or GitHub Actions) that runs every day, checks if exactly 30 days have passed since a session, and automatically blasts out emails to those participants.

---

## 5. Deployment Pipeline

- **Frontend Deployment:** Host your React frontend on **Vercel**. 
- **Environment Variables:** Set up `.env` files locally and environment variables in your Vercel project to securely store `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
