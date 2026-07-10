import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { fileRouter } from "./routes/files.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.PORT || "3005");

const app = express();
app.use(express.json());

app.use("/files", fileRouter);
app.use("/uploads", express.static(path.join(__dirname, "../storage")));

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "file" });
});

app.use((err, req, res, next) => {
  console.error(`[File Error] ${err.message}`);
  res.status(err.status || 500).json({ success: false, message: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`[File Service] running on port ${PORT}`);
});
