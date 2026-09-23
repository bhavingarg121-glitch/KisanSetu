# KisanSetu Database Setup (Supabase / PostgreSQL)

This folder contains the complete relational schema and seed dataset for **KisanSetu** MSP Dynamic Slotting & Mandi Queue Portal.

## Setup Instructions

### 1. Create a Supabase Project
1. Log in to [Supabase Console](https://app.supabase.com).
2. Create a new project named `kisansetu-msp`.
3. Note your `SUPABASE_URL` and `SUPABASE_ANON_KEY` or `SUPABASE_SERVICE_ROLE_KEY` from **Project Settings > API**.

### 2. Apply Schema & Seed Data
1. Navigate to **SQL Editor** in your Supabase dashboard.
2. Open [schema.sql](file:///C:/Users/bhavi/.gemini/antigravity-ide/scratch/sih/database/schema.sql) and run the query to create all tables, enums, triggers, and indices.
3. Open [seed.sql](file:///C:/Users/bhavi/.gemini/antigravity-ide/scratch/sih/database/seed.sql) and run the query to populate sample procurement centers, time slots, and active tokens.

### 3. Connect to Backend & Frontend
- **FastAPI Backend**: Update `backend/.env` with your `SUPABASE_URL` and `SUPABASE_KEY`.
- **React Frontend**: The frontend automatically operates in unified multi-tab live sync mode using `BroadcastChannel` & `LocalStorage`, and can optionally point directly to your Supabase project using `@supabase/supabase-js`.
