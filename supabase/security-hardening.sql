-- Run this in the Supabase SQL editor before relying on the application-level
-- AI usage limiter and progress upsert paths in production.

create unique index if not exists user_ai_usage_user_date_idx
  on public.user_ai_usage (user_id, usage_date);

create unique index if not exists user_progress_user_week_idx
  on public.user_progress (user_id, week_id);

alter table if exists public.users enable row level security;
alter table if exists public.user_ai_usage enable row level security;
alter table if exists public.user_progress enable row level security;

revoke all on table public.users from anon, authenticated;
revoke all on table public.user_ai_usage from anon, authenticated;
revoke all on table public.user_progress from anon, authenticated;

grant select on table public.course_weeks to anon, authenticated;
grant select on table public.fundamental_hurdles to anon, authenticated;

create or replace function public.increment_ai_usage(
  p_user_id text,
  p_usage_date date,
  p_limit integer
)
returns table (
  allowed boolean,
  request_count integer,
  remaining integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_count integer;
begin
  if p_user_id is null or length(trim(p_user_id)) = 0 then
    raise exception 'p_user_id is required';
  end if;

  if p_limit is null or p_limit < 1 then
    raise exception 'p_limit must be positive';
  end if;

  select usage.request_count
    into current_count
  from public.user_ai_usage as usage
  where usage.user_id = p_user_id
    and usage.usage_date = p_usage_date
  for update;

  if not found then
    current_count := 1;

    insert into public.user_ai_usage (user_id, usage_date, request_count)
    values (p_user_id, p_usage_date, current_count);

    allowed := true;
    request_count := current_count;
    remaining := greatest(0, p_limit - current_count);
    return next;
    return;
  end if;

  if current_count >= p_limit then
    allowed := false;
    request_count := current_count;
    remaining := 0;
    return next;
    return;
  end if;

  current_count := current_count + 1;

  update public.user_ai_usage
  set request_count = current_count
  where user_id = p_user_id
    and usage_date = p_usage_date;

  allowed := true;
  request_count := current_count;
  remaining := greatest(0, p_limit - current_count);
  return next;
end;
$$;

revoke all on function public.increment_ai_usage(text, date, integer) from public;
grant execute on function public.increment_ai_usage(text, date, integer) to service_role;