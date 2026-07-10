import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ padding: "4rem", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "4rem", margin: "0", color: "#e53e3e" }}>404</h1>
      <p style={{ fontSize: "1.2rem", color: "#666" }}>Halaman tidak ditemukan</p>
      <Link
        href="/"
        style={{
          display: "inline-block",
          marginTop: "1rem",
          padding: "10px 20px",
          background: "#1a56db",
          color: "white",
          textDecoration: "none",
          borderRadius: "6px",
        }}
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
