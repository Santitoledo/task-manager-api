import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();


router.get("/", async (req, res) => {
  const users = await prisma.user.findMany();

  res.json(users);
});

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

router.put("/:id", async (req, res) => {
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

  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: {
      name: req.body.name,
      email: req.body.email,
    },
  });

  res.json(updatedUser);
});

router.delete("/:id", async (req, res) => {
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

  const deletedUser = await prisma.user.delete({
    where: {
      id,
    },
  });

  return res.json({
  message: "Usuario eliminado correctamente",
});
});

export default router;