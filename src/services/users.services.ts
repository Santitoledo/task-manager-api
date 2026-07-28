import { prisma } from "../lib/prisma";

export async function getUsersService() {
  return prisma.user.findMany();
}


export async function getUserByIdService(id: number) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

export async function createUserService (name: string, email: string){
    return prisma.user.create({
        data: {
            name,
            email,
        },
    });
}

export async function updateUserService(id: number,name: string,email: string) {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    return null;
  }

  return prisma.user.update({
    where: {
      id,
    },
    data: {
      name,
      email,
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