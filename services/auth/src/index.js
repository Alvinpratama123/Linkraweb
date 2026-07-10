import express from "express";
import { authRouter } from "./routes/auth.js";
import { userRouter } from "./routes/users.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = parseInt(process.env.PORT || "3001");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/users", userRouter);

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "auth" });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[Auth Service] running on port ${PORT}`);
});
