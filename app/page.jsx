import KatalogProduk from "@/components/KatalogProduk";
import { createServerClient } from "@/lib/supabase/server";
import { toko } from "@/lib/toko";

export default async function HalamanKatalog() {
  let daftarProduk = [];
  let error = null;

  try {
    const supabase = createServerClient();
    const { data, error: dbError } = await supabase
      .from("produk")
      .select("*")
      .order("created_at", { ascending: false });

    if (dbError) {
      error = dbError.message;
    } else {
      daftarProduk = data || [];
    }
  } catch (err) {
    error = err.message || "Gagal mengambil data produk.";
  }

  return (
    <div className="py-6 sm:py-10">
      {/* Banner / Bagian Utama Toko Diskuy */}
      <section className="mb-8 rounded-3xl border border-garis bg-permukaan p-6 sm:p-10">
        <div className="flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-garis bg-latar px-3 py-1 text-xs font-semibold text-utama">
            <span className="h-2 w-2 rounded-full bg-utama"></span>
            Buka: {toko.jamBuka}
          </div>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl text-teks">
            {toko.nama}
          </h1>
          <p className="max-w-2xl text-base sm:text-lg text-teks-lembut">
            {toko.tagline}
          </p>
          {toko.alamat && (
            <p className="text-xs sm:text-sm text-teks-lembut">
              📍 {toko.alamat}
            </p>
          )}
        </div>
      </section>

      {/* Bagian Katalog Produk & Pencarian */}
      <section aria-labelledby="judul-produk" className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 id="judul-produk" className="text-2xl font-bold tracking-tight text-teks">
            Katalog Produk
          </h2>
        </div>

        {error ? (
          <p className="rounded-lg border border-dashed border-bahaya bg-permukaan px-3 py-2 text-sm text-bahaya">
            Gagal memuat produk: {error}
          </p>
        ) : daftarProduk.length === 0 ? (
          <p className="rounded-lg border border-dashed border-garis bg-permukaan px-3 py-2 text-sm text-teks-lembut">
            Belum ada produk
          </p>
        ) : (
          <KatalogProduk daftarProduk={daftarProduk} />
        )}
      </section>
    </div>
  );
}
