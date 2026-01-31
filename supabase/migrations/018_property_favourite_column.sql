-- Eliminar tabla property_favorites
DROP POLICY IF EXISTS "Users can delete own favorites" ON property_favorites;
DROP POLICY IF EXISTS "Users can insert own favorites" ON property_favorites;
DROP POLICY IF EXISTS "Users can view own favorites" ON property_favorites;
DROP TABLE IF EXISTS property_favorites;

-- Añadir columna favourite en scraper_properties
ALTER TABLE scraper_properties ADD COLUMN IF NOT EXISTS favourite BOOLEAN DEFAULT FALSE;
