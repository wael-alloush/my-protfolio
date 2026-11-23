import { z } from "zod";
import { form } from "@/content/ar";

export const contactSchema = z.object({
  name: z.string().trim().min(2, form.errors.name),
  phone: z
    .string()
    .trim()
    .min(8, form.errors.phone)
    .regex(/^[0-9+\-\s()]+$/, form.errors.phone),
  email: z.string().trim().email(form.errors.email),
  siteType: z.string().min(1, form.errors.siteType),
  message: z.string().trim().min(10, form.errors.message),
});

export type ContactInput = z.infer<typeof contactSchema>;
