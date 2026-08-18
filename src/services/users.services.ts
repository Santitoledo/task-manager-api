import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import { UpdateUserInput } from "../schemas/user.schema";

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
  data: UpdateUserInput
)
 
 {
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

const updateData: {
  name?: string;
  email?: string;
} = {};

if (data.name !== undefined) {
  updateData.name = data.name;
}

if (data.email !== undefined) {
  updateData.email = data.email;
}

 return prisma.user.update({
  where: {
    id,
  },
  data: updateData,
  select: {
    id: true,
    name: true,
    email: true,
    role: true,
  },
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