import { Router } from "express";

const router = Router();

const users = [
  {
    id: 1,
    name: "Santiago",
    email: "santi@gmail.com",
  },
  {
    id: 2,
    name: "Juan",
    email: "juan@gmail.com",
  },
];

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  console.log(id);
  console.log(users);

  const user = users.find((u) => u.id === id);

  console.log(user);
if (!user) {
  return res.status(404).json({
    message: "Usuario no encontrado",
  });
}
  res.json(user);
});

router.post("/", (req, res) => {
  users.push({
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email,
  });

  res.json(users);
});

export default router;