import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";


export async function getUsersService() {
  return prisma.user.findMany({
    select: {   //selecciona las propiedades que queremos
      id: true,
      name: true,
      email: true,
    },
  });
}


export async function getUserByIdService(id: number) {
  return prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
}

export async function createUserService (name: string, email: string, password: string){
  const hashedPassword = await bcrypt.hash(password,10)
    return prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
    });
}

export async function updateUserService(
  id: number,
  name?: string,
  email?: string
) {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
          id: true,
          name: true,
          email: true,
        },
  });

  if (!user) {
    return null;
  }

  const data: { name?: string; email?: string } = {};

  if (name !== undefined) {
    data.name = name;
  }

  if (email !== undefined) {
    data.email = email;
  }

  return prisma.user.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteUserService(id: number) {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    return null;
  }

  return prisma.user.delete({
    where: {
      id,
    },
    
  });
}