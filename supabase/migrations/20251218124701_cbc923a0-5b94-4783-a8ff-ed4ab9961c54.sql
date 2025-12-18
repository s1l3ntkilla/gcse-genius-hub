-- Create app_role enum if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
    END IF;
END$$;

-- Add updated_at to profiles if missing
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create user_roles table if not exists
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to check group membership
CREATE OR REPLACE FUNCTION public.is_group_member(_user_id UUID, _group_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.group_members
    WHERE user_id = _user_id
      AND group_id = _group_id
  )
$$;

-- Function to check if user is group admin
CREATE OR REPLACE FUNCTION public.is_group_admin(_user_id UUID, _group_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.group_members
    WHERE user_id = _user_id
      AND group_id = _group_id
      AND role IN ('admin', 'creator')
  )
$$;

-- RLS POLICIES for profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- RLS POLICIES for user_roles
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can insert roles" ON public.user_roles;
CREATE POLICY "System can insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- RLS POLICIES for group_chats
DROP POLICY IF EXISTS "Members can view their groups" ON public.group_chats;
CREATE POLICY "Members can view their groups" ON public.group_chats FOR SELECT TO authenticated USING (public.is_group_member(auth.uid(), id));

DROP POLICY IF EXISTS "Authenticated users can create groups" ON public.group_chats;
CREATE POLICY "Authenticated users can create groups" ON public.group_chats FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Group admins can update groups" ON public.group_chats;
CREATE POLICY "Group admins can update groups" ON public.group_chats FOR UPDATE TO authenticated USING (public.is_group_admin(auth.uid(), id));

DROP POLICY IF EXISTS "Group creators can delete groups" ON public.group_chats;
CREATE POLICY "Group creators can delete groups" ON public.group_chats FOR DELETE TO authenticated USING (created_by = auth.uid());

-- RLS POLICIES for group_members
DROP POLICY IF EXISTS "Members can view group members" ON public.group_members;
CREATE POLICY "Members can view group members" ON public.group_members FOR SELECT TO authenticated USING (public.is_group_member(auth.uid(), group_id));

DROP POLICY IF EXISTS "Users can add members" ON public.group_members;
CREATE POLICY "Users can add members" ON public.group_members FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Group admins can update members" ON public.group_members;
CREATE POLICY "Group admins can update members" ON public.group_members FOR UPDATE TO authenticated USING (public.is_group_admin(auth.uid(), group_id) OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Members can leave" ON public.group_members;
CREATE POLICY "Members can leave" ON public.group_members FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.is_group_admin(auth.uid(), group_id));

-- RLS POLICIES for group_messages
DROP POLICY IF EXISTS "Members can view group messages" ON public.group_messages;
CREATE POLICY "Members can view group messages" ON public.group_messages FOR SELECT TO authenticated USING (public.is_group_member(auth.uid(), group_id));

DROP POLICY IF EXISTS "Members can send messages" ON public.group_messages;
CREATE POLICY "Members can send messages" ON public.group_messages FOR INSERT TO authenticated WITH CHECK (public.is_group_member(auth.uid(), group_id) AND auth.uid() = sender_id);

DROP POLICY IF EXISTS "Users can edit own messages" ON public.group_messages;
CREATE POLICY "Users can edit own messages" ON public.group_messages FOR UPDATE TO authenticated USING (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Users can delete own messages" ON public.group_messages;
CREATE POLICY "Users can delete own messages" ON public.group_messages FOR DELETE TO authenticated USING (auth.uid() = sender_id OR public.is_group_admin(auth.uid(), group_id));

-- Handle new user trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, profile_picture_url, oauth_provider)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NEW.raw_user_meta_data ->> 'picture', ''),
    NEW.raw_app_meta_data ->> 'provider'
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_group_chats_updated_at ON public.group_chats;
CREATE TRIGGER update_group_chats_updated_at BEFORE UPDATE ON public.group_chats FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON public.group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_messages_group_id ON public.group_messages(group_id);
CREATE INDEX IF NOT EXISTS idx_group_messages_created_at ON public.group_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);