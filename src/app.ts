
import express from "express";
import usersRouter from "./routes/users";
import authRouter from "./routes/auth";
import {logger} from "./middlewares/logger.middleware";

const app = express();

app.use(express.json());

app.use(logger);

app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.get("/", (req, res) => {
  res.json({
    message: "API funcionando",
  });
});

export default app; 