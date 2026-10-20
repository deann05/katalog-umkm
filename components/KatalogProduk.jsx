"use client";

import { useState, useMemo } from "react";
import KartuProduk from "@/components/KartuProduk";

export default function KatalogProduk({ daftarProduk = [] }) {
  const [kataKunci, setKataKunci] = useState("");
  const [kategoriTerpilih, setKategoriTerpilih] = useState("Semua");

  // Dapatkan daftar kategori unik dari data produk
  const daftarKategori = useMemo(() => {
    const setKategori = new Set();
    daftarProduk.forEach((p) => {
      if (p.kategori) setKategori.add(p.kategori);
    });
    return ["Semua", ...Array.from(setKategori)];
  }, [daftarProduk]);

  // Saring produk berdasarkan kata kunci pencarian dan kategori
  const produkTersaring = useMemo(() => {
    return daftarProduk.filter((produk) => {
      const cocokKategori =
        kategoriTerpilih === "Semua" || produk.kategori === kategoriTerpilih;

      const q = kataKunci.trim().toLowerCase();
      const cocokKataKunci =
        !q ||
        produk.nama?.toLowerCase().includes(q) ||
        produk.deskripsi?.toLowerCase().includes(q) ||
        produk.kategori?.toLowerCase().includes(q);

      return cocokKategori && cocokKataKunci;
    });
  }, [daftarProduk, kataKunci, kategoriTerpilih]);

  const adaFilterAktif = kataKunci.trim() !== "" || kategoriTerpilih !== "Semua";

  const resetFilter = () => {
    setKataKunci("");
    setKategoriTerpilih("Semua");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Bagian Kontrol Pencarian & Filter Kategori */}
      <div className="flex flex-col gap-3 rounded-2xl border border-garis bg-permukaan p-4 sm:p-5">
        {/* Kolom Pencarian */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-teks-lembut">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="search"
            value={kataKunci}
            onChange={(e) => setKataKunci(e.target.value)}
            placeholder="Cari produk yang kamu inginkan (misal: kopi, keripik)..."
            className="w-full rounded-xl border border-garis bg-latar py-3 pl-11 pr-10 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
          />
          {kataKunci && (
            <button
              type="button"
              onClick={() => setKataKunci("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-teks-lembut hover:text-teks"
              title="Hapus kata kunci"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filter Kategori Berbentuk Kancing/Pill */}
        {daftarKategori.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-teks-lembut">Kategori:</span>
            {daftarKategori.map((kategori) => {
              const aktif = kategoriTerpilih === kategori;
              return (
                <button
                  key={kategori}
                  type="button"
                  onClick={() => setKategoriTerpilih(kategori)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    aktif
                      ? "bg-utama text-white"
                      : "border border-garis bg-latar text-teks-lembut hover:border-utama hover:text-utama"
                  }`}
                >
                  {kategori}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Baris Status Hasil Pencarian */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-teks-lembut">
          {adaFilterAktif ? (
            <>
              Menemukan <strong className="text-teks">{produkTersaring.length}</strong> produk
              {kataKunci.trim() && (
                <span>
                  {" "}
                  untuk &ldquo;<span className="text-teks">{kataKunci.trim()}</span>&rdquo;
                </span>
              )}
              {kategoriTerpilih !== "Semua" && (
                <span>
                  {" "}
                  dalam kategori &ldquo;<span className="text-teks">{kategoriTerpilih}</span>&rdquo;
                </span>
              )}
            </>
          ) : (
            <>
              Total <strong className="text-teks">{daftarProduk.length}</strong> produk tersedia
            </>
          )}
        </p>

        {adaFilterAktif && (
          <button
            type="button"
            onClick={resetFilter}
            className="text-xs font-semibold text-utama underline underline-offset-4 hover:text-utama-gelap"
          >
            Reset pencarian
          </button>
        )}
      </div>

      {/* Grid Produk atau Status Kosong */}
      {produkTersaring.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-garis bg-permukaan py-12 px-4 text-center">
          <svg
            className="h-12 w-12 text-teks-lembut"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p className="mt-3 font-semibold text-teks">Produk tidak ditemukan</p>
          <p className="mt-1 text-sm text-teks-lembut">
            Tidak ada produk yang cocok dengan pencarian atau filter yang dipilih.
          </p>
          <button
            type="button"
            onClick={resetFilter}
            className="mt-4 rounded-lg bg-utama px-4 py-2 text-xs font-semibold text-white hover:bg-utama-gelap"
          >
            Tampilkan semua produk
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {produkTersaring.map((produk) => (
            <KartuProduk key={produk.id} produk={produk} />
          ))}
        </div>
      )}
    </div>
  );
}

