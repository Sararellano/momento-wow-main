-- ============================================================================
-- SUPABASE SETUP - PASO 3: SAMPLE DATA (OPTIONAL)
-- Execute AFTER paso2.sql if you want test data
-- ============================================================================

INSERT INTO rsvps (event_id, data) VALUES
  ('demo-boda-elena-mateo', '{"name":"Juan García","guests":"2","attendance":"yes"}'),
  ('demo-boda-elena-mateo', '{"name":"María López","guests":"1","attendance":"yes"}'),
  ('demo-baby-shower-sofia', '{"name":"Abuela Carmen","attendance":"yes","message":"¡Qué felicidad!"}'),
  ('demo-cumple-capitan-lucas', '{"name":"Niño 1","guests":"1","attendance":"yes"}'),
  ('demo-summit-empresarial-2026', '{"name":"Carlos Pérez","email":"carlos@empresa.com","company":"Tech Solutions","attendance":"yes"}');
