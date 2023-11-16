import { z } from "zod";

export const taskSchema = z.object({
  collectionId: z.number().nonnegative(),
  content: z.string().min(8, {
    message: "Task content must be at least 8 characters",
  }),
  expiresAt: z.date().optional(),
});

export type taskSchemaType = z.infer<typeof taskSchema>;
