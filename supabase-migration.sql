-- ============================================================
-- WINE JET ABKHAZIA — Supabase Migration
-- Выполнить в: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- Расширение для UUID (уже есть в Supabase по умолчанию)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------
-- Таблица: wines
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wines (
  id          UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  name        TEXT        NOT NULL,
  type        TEXT        NOT NULL,
  year        TEXT        NOT NULL,
  grapes      TEXT        NOT NULL,
  description TEXT        NOT NULL,
  price       TEXT        NOT NULL,
  image_url   TEXT        NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ------------------------------------------------------------
-- Таблица: news
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS news (
  id          UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  title       TEXT        NOT NULL,
  date        TEXT        NOT NULL,
  preview     TEXT        NOT NULL,
  content     TEXT        NOT NULL,
  image       TEXT        NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
ALTER TABLE wines ENABLE ROW LEVEL SECURITY;
ALTER TABLE news  ENABLE ROW LEVEL SECURITY;

-- Публичное чтение (для сайта)
CREATE POLICY "Public can read wines"
  ON wines FOR SELECT USING (true);

CREATE POLICY "Public can read news"
  ON news FOR SELECT USING (true);

-- Запись только для аутентифицированного admin
CREATE POLICY "Authenticated can insert wines"
  ON wines FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update wines"
  ON wines FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete wines"
  ON wines FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can insert news"
  ON news FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update news"
  ON news FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete news"
  ON news FOR DELETE USING (auth.role() = 'authenticated');

-- ------------------------------------------------------------
-- Автообновление updated_at
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER wines_updated_at
  BEFORE UPDATE ON wines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------
-- Storage: bucket "images" (публичный)
-- Выполни вручную в Dashboard → Storage → New bucket:
--   Name: images
--   Public bucket: YES
-- Или раскомментируй строку ниже (требует прав service_role):
-- INSERT INTO storage.buckets (id, name, public)
--   VALUES ('images', 'images', true)
--   ON CONFLICT (id) DO NOTHING;
-- ------------------------------------------------------------

-- Storage RLS (если создаёшь bucket через SQL выше)
-- CREATE POLICY "Public read images"
--   ON storage.objects FOR SELECT USING (bucket_id = 'images');
--
-- CREATE POLICY "Auth upload images"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
--
-- CREATE POLICY "Auth delete images"
--   ON storage.objects FOR DELETE
--   USING (bucket_id = 'images' AND auth.role() = 'authenticated');
