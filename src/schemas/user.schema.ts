import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.email({ message: "Invalid email" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).optional(),
  email: z.email({ message: "Invalid email" }).optional(),
}).refine(
  (data) => data.name !== undefined || data.email !== undefined,
  {
    message: "At least one field must be provided",
  }
);
export type UpdateUserInput = z.infer<typeof updateUserSchema>; //TypeScript, creame automáticamente un tipo basándote en updateUserSchema.

export const userIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/* export const updateUserSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).optional(),
  email: z.email({ message: "Invalid email" }).optional(),
});  lo usaremos cuando un endpoint permita actualizar parcialmente*/