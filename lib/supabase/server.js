import { createClient } from "@supabase/supabase-js";

// Koneksi server untuk membaca data publik (katalog, detail produk).
// Memakai SUPABASE_SECRET_KEY agar bisa melewati RLS untuk membaca data.
export function createServerClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error("SUPABASE_URL dan SUPABASE_SECRET_KEY harus diisi di environment variable.");
  }

  return createClient(supabaseUrl, supabaseSecretKey);
}

