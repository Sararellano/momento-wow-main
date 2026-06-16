-- ============================================================================
-- Momento Wow - Supabase Schema
-- Execute this in Supabase SQL Editor to set up tables and policies
-- ============================================================================

-- ============================================================================
-- 1. RSVP Responses Table (required for all demos)
-- ============================================================================
CREATE TABLE IF NOT EXISTS rsvps (
  id BIGSERIAL PRIMARY KEY,
  event_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data JSONB NOT NULL,

  -- Indexes for fast queries
  CONSTRAINT rsvps_event_id_check CHECK (event_id != '')
);

CREATE INDEX IF NOT EXISTS rsvps_event_id_idx ON rsvps(event_id);
CREATE INDEX IF NOT EXISTS rsvps_created_at_idx ON rsvps(created_at);

-- Enable RLS
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- Allow anyone to INSERT (no auth required for demos)
CREATE POLICY "Allow public insert on rsvps" ON rsvps
  FOR INSERT WITH CHECK (true);

-- ============================================================================
-- 2. Page Analytics Table (optional, for evento-corporativo demo)
-- ============================================================================
CREATE TABLE IF NOT EXISTS page_analytics (
  id BIGSERIAL PRIMARY KEY,
  event_id TEXT NOT NULL,
  session_id UUID NOT NULL,
  device_type TEXT,
  time_spent_seconds INTEGER,
  map_clicks INTEGER DEFAULT 0,
  sections_viewed TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT page_analytics_event_id_check CHECK (event_id != '')
);

CREATE INDEX IF NOT EXISTS page_analytics_event_id_idx ON page_analytics(event_id);
CREATE INDEX IF NOT EXISTS page_analytics_session_id_idx ON page_analytics(session_id);

-- Enable RLS
ALTER TABLE page_analytics ENABLE ROW LEVEL SECURITY;

-- Allow anyone to INSERT
CREATE POLICY "Allow public insert on page_analytics" ON page_analytics
  FOR INSERT WITH CHECK (true);

-- ============================================================================
-- 3. User Roles Table (for dashboard auth)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_roles (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'client')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS user_roles_user_id_idx ON user_roles(user_id);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Users can read their own role
CREATE POLICY "Users can read own role" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can read all roles
CREATE POLICY "Admins can read all roles" ON user_roles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- ============================================================================
-- 4. Event Owners Table (multi-tenant: link clients to their events)
-- ============================================================================
CREATE TABLE IF NOT EXISTS event_owners (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, event_id)
);

CREATE INDEX IF NOT EXISTS event_owners_user_id_idx ON event_owners(user_id);
CREATE INDEX IF NOT EXISTS event_owners_event_id_idx ON event_owners(event_id);

-- Enable RLS
ALTER TABLE event_owners ENABLE ROW LEVEL SECURITY;

-- Users can read events they own
CREATE POLICY "Users can read own events" ON event_owners
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can read all event owners
CREATE POLICY "Admins can read all event owners" ON event_owners
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- ============================================================================
-- 5. RSVP SELECT Policy (for dashboard & public queries)
-- ============================================================================
-- Admins see all RSVPs, clients see only RSVPs from their events, public can read all
CREATE POLICY "Allow read RSVPs" ON rsvps
  FOR SELECT USING (
    -- Admin: read all
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
    OR
    -- Client: read only assigned events
    EXISTS (
      SELECT 1 FROM event_owners eo
      WHERE eo.user_id = auth.uid() AND eo.event_id = rsvps.event_id
    )
    OR
    -- Public: anonymous can read (for demo)
    auth.uid() IS NULL
  );

-- ============================================================================
-- 6. Helper Function: Create user with role
-- Usage: SELECT create_user_with_role('user@email.com', 'client');
-- ============================================================================
CREATE OR REPLACE FUNCTION create_user_with_role(
  user_email TEXT,
  user_role TEXT DEFAULT 'client'
)
RETURNS TABLE (user_id UUID, email TEXT, role TEXT) AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Create user (requires auth context - only works via Auth API normally)
  -- For manual setup, use Supabase Auth UI instead

  -- If you need to set role after user creation:
  -- 1. Create user via Supabase Auth UI
  -- 2. Get their user_id
  -- 3. Run: INSERT INTO user_roles(user_id, role) VALUES('{user_id}', 'client');

  RAISE NOTICE 'Use Supabase Auth UI to create users, then assign roles manually.';
  RETURN QUERY SELECT new_user_id, user_email, user_role;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 7. Sample Data (for testing - delete in production)
-- ============================================================================
-- Uncomment to populate test data:
/*
INSERT INTO rsvps (event_id, data) VALUES
  ('demo-boda-elena-mateo', '{"name":"Juan García","guests":"2","attendance":"yes"}'),
  ('demo-boda-elena-mateo', '{"name":"María López","guests":"1","attendance":"yes"}'),
  ('demo-baby-shower-sofia', '{"name":"Abuela Carmen","attendance":"yes","message":"¡Qué felicidad!"}'),
  ('demo-cumple-capitan-lucas', '{"name":"Niño 1","guests":"1","attendance":"yes"}');
*/

-- ============================================================================
-- Notes:
-- - Uncomment the sample data to test
-- - For dashboard: Create users via Supabase Auth, then assign roles
-- - event_owners: Link users to specific events they manage
-- - RLS policies allow public RSVPs for demos
-- ============================================================================
