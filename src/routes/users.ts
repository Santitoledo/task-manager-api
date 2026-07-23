import { Router } from "express";
import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";

const router = Router();


router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    return res.json(users);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
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

    return res.json(user);

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});
 

router.post("/", async (req, res) => {
const { name, email } = req.body;

if (!name) {
  return res.status(400).json({
    message: "Name is required",
  });
}

if (!email) {
  return res.status(400).json({
    message: "Email is required",
  });
}

try {
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
    },
  });

  return res.status(201).json(newUser);

} catch (error) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    return res.status(409).json({
      message: "Email already exists",
    });
  }

  return res.status(500).json({
    message: "Internal server error",
  });
}
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