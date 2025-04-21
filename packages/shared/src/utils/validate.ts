import { ZodSchema } from "zod";

export const validate = <T>(
  data: unknown,
  schema: ZodSchema<T>,
):
  | { success: true; data: T }
  | { success: false; error: { message: string } } => {
  const result = schema.safeParse(data);

  if (!result.success) {
    return { success: false, error: { message: result.error.message } };
  }

  return { success: true, data: result.data };
};
