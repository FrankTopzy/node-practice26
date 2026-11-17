import { z } from "zod";


const emailSchema = z.string().email();

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: emailSchema
});


export const createTaskSchema = z.object({
  title: z.string().trim().min(3).max(255),
  description: z.string().nullable().optional(),
  completed: z.boolean().optional(),
  priority: z.enum(["low", "normal", "high"]).optional()
});

export const updateTaskSchema = createTaskSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided"
    }
  );

export const taskIdSchema = z.object({
  id: z.coerce.number().int().positive()
});

export const taskQuerySchema = z.object({
  completed: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional()
});