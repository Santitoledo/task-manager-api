
import express from "express";
import usersRouter from "./routes/users";

const app = express();

app.use(express.json());
app.use("/users", usersRouter);
app.get("/", (req, res) => {
  res.json({
    message: "API funcionando",
  });
});

export default app;