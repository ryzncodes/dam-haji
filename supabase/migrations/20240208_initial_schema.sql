-- Create profiles table that extends the auth.users table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  is_guest boolean default false,
  guest_id text unique,
  rating integer default 1200,
  games_played integer default 0,
  games_won integer default 0,
  games_lost integer default 0,
  games_drawn integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies for profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update their own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Create games table
create table public.games (
  id uuid default gen_random_uuid() primary key,
  player_black uuid references public.profiles(id),
  player_red uuid references public.profiles(id),
  status text check (status in ('waiting', 'in_progress', 'completed', 'abandoned')) default 'waiting',
  winner uuid references public.profiles(id),
  current_turn uuid references public.profiles(id),
  board_state jsonb not null,
  move_history jsonb[] default array[]::jsonb[],
  started_at timestamp with time zone,
  ended_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies for games
alter table public.games enable row level security;

create policy "Games are viewable by everyone"
  on public.games for select
  using ( true );

create policy "Authenticated users can insert games"
  on public.games for insert
  with check ( auth.role() = 'authenticated' );

create policy "Players can update their own games"
  on public.games for update
  using ( 
    auth.uid() = player_black or 
    auth.uid() = player_red
  );

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

create trigger handle_games_updated_at
  before update on public.games
  for each row
  execute function public.handle_updated_at(); 