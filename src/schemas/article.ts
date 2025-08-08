import { z } from "zod";

export const articleFormSchema = z.object({
  title: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  content: z.string()
    .min(10, "Content must be at least 10 characters")
    .max(5000, "Content must be less than 5000 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  imageUrl: z.string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
});

export type ArticleFormValues = z.infer<typeof articleFormSchema>;