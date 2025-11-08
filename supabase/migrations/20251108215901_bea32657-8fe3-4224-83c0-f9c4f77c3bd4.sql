-- Fix RLS recursion risk by using the security definer function
-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Recreate the policy using the has_role() security definer function
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Restrict profiles visibility to authenticated users only
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Recreate with authenticated-only access
CREATE POLICY "Profiles are viewable by authenticated users"
ON public.profiles
FOR SELECT
USING (auth.role() = 'authenticated');