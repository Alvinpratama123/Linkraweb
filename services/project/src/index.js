import express from "express";
import { projectRouter } from "./routes/projects.js";
import { attachmentRouter } from "./routes/attachments.js";

const app = express();
const PORT = parseInt(process.env.PORT || "3002");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/projects", projectRouter);
app.use("/attachments", attachmentRouter);

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "project" });
});

app.use((err, req, res, next) => {
  console.error(`[Project Error] ${err.message}`);
  res.status(err.status || 500).json({ success: false, message: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`[Project Service] running on port ${PORT}`);
});
