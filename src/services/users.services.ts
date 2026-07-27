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