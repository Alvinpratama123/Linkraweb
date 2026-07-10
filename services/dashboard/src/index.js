import express from "express";
import { dashboardRouter } from "./routes/dashboard.js";

const app = express();
const PORT = parseInt(process.env.PORT || "3007");

app.use(express.json());

app.use("/dashboard", dashboardRouter);

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "dashboard" });
});

app.use((err, req, res, next) => {
  console.error(`[Dashboard Error] ${err.message}`);
  res.status(err.status || 500).json({ success: false, message: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`[Dashboard Service] running on port ${PORT}`);
});
