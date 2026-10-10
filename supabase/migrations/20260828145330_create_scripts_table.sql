/*
# Create scripts table for AURA anchoring assistant

1. New Tables
- `scripts` — stores AI-generated anchoring scripts created by users
  - `id` (uuid, primary key)
  - `title` (text, not null) — user-given name for the script
  - `event_type` (text, not null) — type of event (Tech Fest, Conference, etc.)
  - `tone` (text, not null, default 'professional') — desired tone
  - `duration` (text, not null, default '30 min') — estimated event duration
  - `audience` (text) — target audience description
  - `content` (text, not null) — the full generated anchoring script
  - `user_id` (uuid, not null, defaults to auth.uid()) — owner of the script
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

2. Security
- Enable RLS on `scripts`.
- Owner-scoped CRUD: each authenticated user can only access rows they own.
- Four separate policies (select/insert/update/delete), all scoped to `authenticated`.
*/

CREATE TABLE IF NOT EXISTS scripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  event_type text NOT NULL,
  tone text NOT NULL DEFAULT 'professional',
  duration text NOT NULL DEFAULT '30 min',
  audience text,
  content text NOT NULL,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_scripts" ON scripts;
CREATE POLICY "select_own_scripts" ON scripts FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_scripts" ON scripts;
CREATE POLICY "insert_own_scripts" ON scripts FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_scripts" ON scripts;
CREATE POLICY "update_own_scripts" ON scripts FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_scripts" ON scripts;
CREATE POLICY "delete_own_scripts" ON scripts FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
