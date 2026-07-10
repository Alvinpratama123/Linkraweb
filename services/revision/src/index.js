import express from "express";
import { revisionRouter } from "./routes/revisions.js";

const app = express();
const PORT = parseInt(process.env.PORT || "3003");

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/revisions", revisionRouter);

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "revision" });
});

app.use((err, req, res, next) => {
  console.error(`[Revision Error] ${err.message}`);
  res.status(err.status || 500).json({ success: false, message: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`[Revision Service] running on port ${PORT}`);
});
