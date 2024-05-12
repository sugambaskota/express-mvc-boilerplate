import { z } from "zod";

export const CreateContactMessageSchema = z.object({
  fullName: z.string({
    required_error: "Full name is required.",
  }),
  email: z
    .string({
      required_error: "Email is required.",
    })
    .email({
      message: "Email must be a valid email.",
    }),
  address: z.string({
    required_error: "Address is required.",
  }),
  contactNumber: z.string({
    required_error: "Contact number is required.",
  }),
  message: z.string({
    required_error: "Message is required.",
  }),
});
