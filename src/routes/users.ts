import { Router } from "express";
import { prisma } from "../lib/prisma";

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

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    return res.status(404).json({
      message: "Usuario no encontrado",
    });
  }

  res.json(user);
});

router.post("/", async (req, res) => {
  const newUser = await prisma.user.create({
    data: {
      name: req.body.name,
      email: req.body.email,
    },
  });

  res.status(201).json(newUser);
});

export default router;