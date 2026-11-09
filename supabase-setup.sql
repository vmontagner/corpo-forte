-- Execute no SQL Editor do Supabase
create table if not exists public.workout_sessions (
  user_id uuid not null references auth.users(id) on delete cascade,
  record_id text not null,
  date timestamptz not null,
  session text not null,
  done jsonb not null default '[]'::jsonb,
  loads jsonb not null default '{}'::jsonb,
  notes text not null default '',
  warmup text not null default '',
  primary key (user_id, record_id)
);
alter table public.workout_sessions enable row level security;
create policy "Users can read own workouts" on public.workout_sessions
for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own workouts" on public.workout_sessions
for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update own workouts" on public.workout_sessions
for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete own workouts" on public.workout_sessions
for delete to authenticated using (auth.uid() = user_id);
