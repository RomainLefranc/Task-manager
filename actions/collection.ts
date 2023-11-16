"use server";
import { prisma } from "@/lib/prisma";
import { collectionSchemaType } from "@/schema/Collection";
import { currentUser } from "@clerk/nextjs";

export async function createCollection(form: collectionSchemaType) {
  const user = await currentUser();

  if (!user) {
    throw new Error("user not found");
  }

  const { color, name } = form;

  return await prisma.collection.create({
    data: {
      userId: user.id,
      color,
      name,
    },
  });
}

export async function updateCollection(id: number, form: collectionSchemaType) {
  const user = await currentUser();

  if (!user) {
    throw new Error("user not found");
  }

  const { color, name } = form;

  return await prisma.collection.update({
    data: {
      color,
      name,
    },
    where: {
      id,
      userId: user.id,
    },
  });
}

export async function deleteCollection(id: number) {
  const user = await currentUser();
  if (!user) {
    throw new Error("user not found");
  }

  return await prisma.collection.delete({
    where: {
      id: id,
      userId: user.id,
    },
  });
}
