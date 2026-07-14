// ============================================================
// CUSTOM DOCUMENT — Struktur HTML dasar aplikasi
// ============================================================
// File ini mengatur struktur HTML yang dibungkus oleh <Html>.
// Berbeda dengan _app.js (render per halaman), file ini
// mengatur elemen HTML tingkat atas: <html>, <head>, <body>.
// ============================================================

import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    // lang="en" → atribut bahasa untuk aksesibilitas SEO
    <Html lang="en">
      {/* Head → tempat meta tags, title, dan link (ditambah otomatis oleh Next.js) */}
      <Head />
      {/* antialiased → meratakan tepi font agar lebih halus di layar */}
      <body className="antialiased">
        {/* Main → konten halaman yang sedang aktif akan dirender di sini */}
        <Main />
        {/* NextScript → script Next.js untuk hydration & navigasi client-side */}
        <NextScript />
      </body>
    </Html>
  );
}
