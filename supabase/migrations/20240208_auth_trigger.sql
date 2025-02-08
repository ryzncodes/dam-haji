-- Create a trigger function to handle new user signups
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, is_guest, guest_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', new.email),
    coalesce((new.raw_user_meta_data->>'is_guest')::boolean, false),
    new.raw_user_meta_data->>'guest_id'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user(); 