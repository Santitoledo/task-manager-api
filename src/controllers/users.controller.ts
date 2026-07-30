
 // import { prisma } from "../lib/prisma";  controller ya no necesita a prisma
import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { getUsersService, getUserByIdService, createUserService, updateUserService, deleteUserService} from "../services/users.services";
import { createUserSchema, userIdSchema  } from "../schemas/user.schema";

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await getUsersService();

    return res.json(users);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getUserById(req: Request, res: Response) {
 
const result = userIdSchema.safeParse(req.params);
if (!result.success) {
  return res.status(400).json({
    errors: result.error.issues,
  });
}
const { id } = result.data;

  try {
    const user = await getUserByIdService(id);


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

const result = createUserSchema.safeParse(req.body);

if (!result.success) {
  return res.status(400).json({
    errors: result.error.issues,
  });
}
  const { name, email } = result.data;

  try {
    const newUser = await createUserService(name, email);
  
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

const idResult = userIdSchema.safeParse(req.params);
if (!idResult.success) {
  return res.status(400).json({
    errors: idResult.error.issues,
  });
}
const { id } = idResult.data;

const bodyResult = createUserSchema.safeParse(req.body);
 if (!bodyResult.success) {
  return res.status(400).json({
    errors: bodyResult.error.issues,
  });
}
const { name, email } = bodyResult.data;

   try {
      const user = await updateUserService(id, name, email);
   
 
   if (!user) {
     return res.status(404).json({
       message: "Usuario no encontrado",
     });
   } 
   
  return res.json(user);

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
  
const idResult = userIdSchema.safeParse(req.params);
if (!idResult.success) {
  return res.status(400).json({
    errors: idResult.error.issues,
  });
}
const { id } = idResult.data;
 try {
const user = await deleteUserService(id);
 

  if (!user) {
    return res.status(404).json({
      message: "Usuario no encontrado",
    });
  }

  return res.json({
  message: "Usuario eliminado correctamente",
});
 } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
 