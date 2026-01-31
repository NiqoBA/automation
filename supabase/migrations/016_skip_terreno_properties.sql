-- Evitar que se inserten propiedades cuyo título CONTIENE "terreno" (case insensitive)
-- Ej: "Terreno en Pocitos", "terreno 200m2", "TERRENO" -> todos bloqueados
DROP TRIGGER IF EXISTS skip_terreno_on_insert ON scraper_properties;

CREATE OR REPLACE FUNCTION skip_terreno_properties()
RETURNS TRIGGER AS $$
BEGIN
  IF COALESCE(NEW.title, '') ~* 'terreno' THEN
    RETURN NULL;  -- No insertar esta fila
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER skip_terreno_on_insert
  BEFORE INSERT ON scraper_properties
  FOR EACH ROW
  EXECUTE FUNCTION skip_terreno_properties();
