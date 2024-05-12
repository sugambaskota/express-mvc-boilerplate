import { z } from "zod";

export const CreateBlogSchema = z.object({
  title: z.string({
    required_error: "Title is required.",
  }),
  thumbImage: z.string({
    required_error: "Thumbnail image is required.",
  }),
  image: z.string({
    required_error: "Image is required.",
  }),
  shortDescription: z.string({
    required_error: "Short description is required.",
  }),
  isPublished: z.boolean({
    required_error: "Is published is required.",
  }),
  description: z.string({
    required_error: "Description is required.",
  }),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  metaTags: z.string().optional(),
  socialTitle: z.string().optional(),
  socialDescription: z.string().optional(),
  socialUrl: z.string().optional(),
  socialImage: z.string().optional(),
});

export const UpdateBlogSchema = CreateBlogSchema;

export const PatchBlogSchema = CreateBlogSchema.partial();
