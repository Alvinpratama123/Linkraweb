import express from "express";
import { emailRouter } from "./routes/emails.js";
import { startEventSubscriber } from "./events/subscriber.js";

const app = express();
const PORT = parseInt(process.env.PORT || "3006");

app.use(express.json());

app.use("/emails", emailRouter);

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "email" });
});

app.use((err, req, res, next) => {
  console.error(`[Email Error] ${err.message}`);
  res.status(err.status || 500).json({ success: false, message: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`[Email Service] running on port ${PORT}`);
  startEventSubscriber();
});
