import express from "express";
import { notificationRouter } from "./routes/notifications.js";
import { startEventSubscriber } from "./events/subscriber.js";

const app = express();
const PORT = parseInt(process.env.PORT || "3004");

app.use(express.json());

app.use("/notifications", notificationRouter);

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "notification" });
});

app.use((err, req, res, next) => {
  console.error(`[Notification Error] ${err.message}`);
  res.status(err.status || 500).json({ success: false, message: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`[Notification Service] running on port ${PORT}`);
  startEventSubscriber();
});
