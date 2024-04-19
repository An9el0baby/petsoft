import { z } from "zod";
export const petFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Name is too short" })
    .max(50, { message: "Name is too long" }),
  ownerName: z
    .string()
    .trim()
    .min(3, { message: "Owner name is too short" })
    .max(50, { message: "Owner name is too long" }),
  imageUrl: z.union([
    z.string().trim().url({ message: "Invalid URL" }),
    z.literal(""),
  ]),
  age: z.coerce
    .number()
    .int()
    .positive({ message: "Age must be a positive number" })
    .max(30, { message: "Age must be less than 30" }),
  notes: z.union([
    z.string().trim().max(200, { message: "Notes is too long" }),
    z.literal(""),
  ]),
});
export type petFormType = z.infer<typeof petFormSchema>;

export const petIdSchema = z.string().cuid();
