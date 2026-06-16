-- ============================================================================
-- SUPABASE SETUP - PASO 1: DROP & CREATE TABLES
-- Execute only this in Supabase SQL Editor
-- ============================================================================

-- Drop existing tables (if any) to start fresh
DROP TABLE IF EXISTS event_owners CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS page_analytics CASCADE;
DROP TABLE IF EXISTS rsvps CASCADE;

-- ============================================================================
-- 1. RSVP Responses Table (required for all demos)
-- ============================================================================
CREATE TABLE rsvps (
  id BIGSERIAL PRIMARY KEY,
  event_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data JSONB NOT NULL,
  CONSTRAINT rsvps_event_id_check CHECK (event_id != '')
);

CREATE INDEX rsvps_event_id_idx ON rsvps(event_id);
CREATE INDEX rsvps_created_at_idx ON rsvps(created_at);

-- ============================================================================
-- 2. Page Analytics Table (optional, for evento-corporativo demo)
-- ============================================================================
CREATE TABLE page_analytics (
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

CREATE INDEX page_analytics_event_id_idx ON page_analytics(event_id);
CREATE INDEX page_analytics_session_id_idx ON page_analytics(session_id);

-- ============================================================================
-- 3. User Roles Table (for dashboard auth)
-- ============================================================================
CREATE TABLE user_roles (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'client')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX user_roles_user_id_idx ON user_roles(user_id);

-- ============================================================================
-- 4. Event Owners Table (multi-tenant: link clients to their events)
-- ============================================================================
CREATE TABLE event_owners (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

CREATE INDEX event_owners_user_id_idx ON event_owners(user_id);
CREATE INDEX event_owners_event_id_idx ON event_owners(event_id);
