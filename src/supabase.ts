/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  as string;
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnon);

// ─── Auth helpers ─────────────────────────────────────────────────────────────

/** Логин по username (без домена) */
export const ADMIN_EMAIL_DOMAIN = '@wine-jet.admin';

export function usernameToEmail(username: string): string {
  return `${username.trim()}${ADMIN_EMAIL_DOMAIN}`;
}

export async function signInWithUsername(username: string, password: string) {
  const email = usernameToEmail(username);
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return supabase.auth.signOut();
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Wine {
  id: string;
  name: string;
  type: string;
  year: string;
  grapes: string;
  desc: string;       // mapped from DB column: description
  price: string;
  imageUrl: string;   // mapped from DB column: image_url
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  preview: string;
  content: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Row mappers ──────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rowToWine(row: any): Wine {
  return {
    id:        row.id,
    name:      row.name,
    type:      row.type,
    year:      row.year,
    grapes:    row.grapes,
    desc:      row.description,
    price:     row.price,
    imageUrl:  row.image_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rowToNewsItem(row: any): NewsItem {
  return {
    id:        row.id,
    title:     row.title,
    date:      row.date,
    preview:   row.preview,
    content:   row.content,
    image:     row.image,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ─── Image upload ─────────────────────────────────────────────────────────────

/**
 * Загружает base64 dataURL в Supabase Storage → bucket "images"
 * Возвращает публичный URL
 */
export async function uploadImage(
  dataUrl: string,
  folder: 'wines' | 'news',
): Promise<string> {
  // base64 → Blob
  const res  = await fetch(dataUrl);
  const blob = await res.blob();
  const ext  = blob.type === 'image/png' ? 'png' : 'jpg';
  const path = `${folder}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from('images')
    .upload(path, blob, { contentType: blob.type, upsert: false });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from('images').getPublicUrl(path);
  return data.publicUrl;
}
