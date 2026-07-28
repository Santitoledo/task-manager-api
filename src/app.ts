
import express from "express";
import usersRouter from "./routes/users";
import {logger} from "./middlewares/logger.middleware";

const app = express();

app.use(express.json());

app.use(logger);

app.use("/users", usersRouter);
app.get("/", (req, res) => {
  res.json({
    message: "API funcionando",
  });
});

export default app; 