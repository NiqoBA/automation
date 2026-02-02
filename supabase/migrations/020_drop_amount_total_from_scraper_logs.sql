-- Eliminar campo de precio/costo de scraper_logs
-- Primero eliminar el trigger que depende de la función
DROP TRIGGER IF EXISTS tr_scraper_billing ON scraper_logs;

-- Eliminar la función que calculaba el billing basado en amount_total
DROP FUNCTION IF EXISTS calculate_scraper_billing();

-- Eliminar la columna
ALTER TABLE scraper_logs DROP COLUMN IF EXISTS amount_total;
