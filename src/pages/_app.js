// ============================================================
// APP WRAPPER — Titik masuk utama Next.js
// ============================================================
// File ini membungkus SEMUA halaman di dalam aplikasi.
// Setiap halaman (index, login, dashboard, dll) akan melewati
// komponen App ini sebelum ditampilkan ke browser.
// ============================================================

// Import CSS global — berisi reset, Tailwind, dan gaya umum
import "@/styles/globals.css";

// Component = halaman yang sedang dibuka (misal: index.js, login.js)
// pageProps = data yang dikirim dari server-side (getServerSideProps, dll)
export default function App({ Component, pageProps }) {
  // Render halaman yang sesuai dengan URL yang diakses user
  return <Component {...pageProps} />;
}
