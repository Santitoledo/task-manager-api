import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import { Prisma } from "@prisma/client";

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany();

    return res.json(users);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getUserById(req: Request, res: Response) {
  const id = Number(req.params.id);

    if (isNaN(id)) {
    return res.status(400).json({
      message: "Invalid user id",
    });
  }

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
}

export async function createUser(req: Request, res: Response) {
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
   }

export async function updateUser(req: Request, res: Response) {
 const id = Number(req.params.id);
   const { name, email } = req.body;

      if (isNaN(id)) {
    return res.status(400).json({
      message: "Invalid user id",
    });
  }
 
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
       name,
       email,
     },
   });
 
   return res.json(updatedUser);
 }  catch (error) {
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
 }

export async function deleteUser(req: Request, res: Response) {
   const id = Number(req.params.id);

      if (isNaN(id)) {
    return res.status(400).json({
      message: "Invalid user id",
    });
  }

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

await prisma.user.delete({
    where: {
      id,
    },
  });

  return res.json({
  message: "Usuario eliminado correctamente",
});
 } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
 