"use server";

import { prisma } from "@/lib/prisma";
import { taskSchemaType } from "@/schema/Task";
import { currentUser } from "@clerk/nextjs";

export async function createTask(data: taskSchemaType) {
  const user = await currentUser();

  if (!user) {
    throw new Error("user not found");
  }

  const { content, expiresAt, collectionId } = data;

  return await prisma.task.create({
    data: {
      userId: user.id,
      content,
      expiresAt,
      Collection: {
        connect: {
          id: collectionId,
        },
      },
    },
  });
}
export async function editTask(id: number, checked: boolean) {
  const user = await currentUser();

  if (!user) {
    throw new Error("user not found");
  }

  return await prisma.task.update({
    where: {
      id: id,
      userId: user.id,
    },
    data: {
      done: checked,
    },
  });
}

export async function updateTask(id: number, data: taskSchemaType) {
  const user = await currentUser();

  if (!user) {
    throw new Error("user not found");
  }
  const { content, expiresAt } = data;

  return await prisma.task.update({
    where: {
      id: id,
      userId: user.id,
    },
    data: {
      content,
      expiresAt,
    },
  });
}

export async function deleteTask(id: number) {
  const user = await currentUser();
  if (!user) {
    throw new Error("user not found");
  }

  return await prisma.task.delete({
    where: {
      id: id,
      userId: user.id,
    },
  });
}
