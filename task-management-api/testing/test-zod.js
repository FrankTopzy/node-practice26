import { createTaskSchema } from "../schemas/taskSchema.js";

const task = {
  title: "Learn Zod",
  completed: "false",
  priority: "high"
};

const result = createTaskSchema.safeParse(task);

if (!result.success) {
  console.log("Validation failed:");
  console.log(result.error.issues);
} else {
  console.log("Validation successful:");
  console.log(result.data);
}