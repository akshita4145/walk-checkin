-- Run once in the Neon SQL editor. All timestamps are UTC (timestamptz).
create table if not exists walks (
  id           text primary key,          -- goes in the friend link
  walker_token text not null unique,      -- goes in the walker's link; lets only her tap "I'm home"
  name         text not null,
  started_at   timestamptz not null default now(),
  expected_at  timestamptz not null,
  arrived_at   timestamptz                -- null until "I'm home"
);
