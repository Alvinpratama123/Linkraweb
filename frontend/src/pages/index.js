export default function Home() {
  return (
    <div style={{ padding: "2rem", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <h1>PT Lintas Wahana Teknologi</h1>
      <p style={{ color: "#666" }}>Sistem Monitoring Proyek</p>
      <div style={{ marginTop: "2rem" }}>
        <a
          href="/auth/login"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            background: "#1a56db",
            color: "white",
            textDecoration: "none",
            borderRadius: "6px",
          }}
        >
          Login
        </a>
      </div>
    </div>
  );
}
