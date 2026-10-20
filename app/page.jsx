import KartuProduk from "@/components/KartuProduk";
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
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-5">
        <h2 id="judul-produk" className="text-xl font-bold">
          Produk kami
        </h2>
        {error ? (
          <p className="rounded-lg border border-dashed border-bahaya bg-permukaan px-3 py-2 text-sm text-bahaya">
            Gagal memuat produk: {error}
          </p>
        ) : daftarProduk.length === 0 ? (
          <p className="rounded-lg border border-dashed border-garis bg-permukaan px-3 py-2 text-sm text-teks-lembut">
            Belum ada produk
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {daftarProduk.map((produk) => (
              <KartuProduk key={produk.id} produk={produk} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
