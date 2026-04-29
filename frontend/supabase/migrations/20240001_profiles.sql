-- =============================================================
-- Migration: profiles table + RLS + auto-create trigger
-- Run this in the Supabase dashboard → SQL editor
-- =============================================================

-- 1. Profiles table
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  age        int,
  gender     text,
  conditions text[]       default '{}',
  created_at timestamptz  default now(),
  updated_at timestamptz  default now()
);

-- 2. Row Level Security
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 3. Auto-create an empty profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
