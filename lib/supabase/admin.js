import { createServerClient as createSSRClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Koneksi sesi admin memakai @supabase/ssr + cookie.
// Dipakai untuk login, keluar, ganti password, dan aksi yang mengubah data.
export async function createAdminClient() {
  const cookieStore = await cookies();

  return createSSRClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Bisa diabaikan jika dipanggil dari Server Component (read-only).
            // Cookie akan diset oleh Server Action atau Route Handler.
          }
        },
      },
    }
  );
}

