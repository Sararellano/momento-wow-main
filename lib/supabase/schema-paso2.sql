-- ============================================================================
-- SUPABASE SETUP - PASO 2: ENABLE RLS & CREATE POLICIES
-- Execute AFTER paso1.sql completes successfully
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_owners ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RSVP Policies
-- ============================================================================
CREATE POLICY "Allow public insert on rsvps" ON rsvps
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read RSVPs" ON rsvps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
    OR
    EXISTS (
      SELECT 1 FROM event_owners eo
      WHERE eo.user_id = auth.uid() AND eo.event_id = rsvps.event_id
    )
    OR
    auth.uid() IS NULL
  );

-- ============================================================================
-- Page Analytics Policies
-- ============================================================================
CREATE POLICY "Allow public insert on page_analytics" ON page_analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read page_analytics" ON page_analytics
  FOR SELECT USING (true);

-- ============================================================================
-- User Roles Policies
-- ============================================================================
CREATE POLICY "Users can read own role" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all roles" ON user_roles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- ============================================================================
-- Event Owners Policies
-- ============================================================================
CREATE POLICY "Users can read own events" ON event_owners
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all event owners" ON event_owners
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );
