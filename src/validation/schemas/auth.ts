import { z } from "zod";

export const RegisterUserSchema = z
  .object({
    fullName: z
      .string({
        invalid_type_error: "Full name must be a string.",
      })
      .min(1, {
        message: "Full name is required.",
      }),
    email: z
      .string({
        invalid_type_error: "Email must be a string.",
      })
      .min(1, {
        message: "Email is required.",
      })
      .email({
        message: "Email must be a valid email.",
      }),
    password: z
      .string({
        invalid_type_error: "Password must be a string.",
      })
      .min(6, {
        message: "Password is required.",
      }),
    confirmPassword: z
      .string({
        invalid_type_error: "Confirm password must be a string.",
      })
      .min(1, {
        message: "Confirm password is required.",
      }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const LoginUserSchema = z.object({
  email: z
    .string({
      invalid_type_error: "Email must be a string.",
    })
    .min(1, {
      message: "Email is required.",
    })
    .email({
      message: "Email must be a valid email.",
    }),
  password: z
    .string({
      invalid_type_error: "Password must be a string.",
    })
    .min(1, {
      message: "Password is required.",
    }),
});

export const PatchUserSchema = z
  .object({
    fullName: z
      .string({
        invalid_type_error: "Full name must be a string.",
      })
      .min(1, {
        message: "Full name is required.",
      }),
    image: z.string({
      invalid_type_error: "Image must be as string",
    }),
  })
  .partial();

export const GetNewTokenSchema = z.object({
  refreshToken: z
    .string({
      invalid_type_error: "Refresh token must be a string.",
    })
    .min(1, {
      message: "Refresh token is required.",
    }),
});

export const UpdatePasswordSchema = z
  .object({
    currentPassword: z
      .string({
        invalid_type_error: "Current password must be a string.",
      })
      .min(1, {
        message: "Current password is required.",
      }),
    newPassword: z
      .string({
        invalid_type_error: "New password must be a string.",
      })
      .min(6, {
        message: "New password is required.",
      }),
    confirmPassword: z
      .string({
        invalid_type_error: "Confirm password must be a string.",
      })
      .min(1, {
        message: "Confirm password is required.",
      }),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const ForgotPasswordSchema = z.object({
  email: z
    .string({
      invalid_type_error: "Email must be a string.",
    })
    .min(1, {
      message: "Email is required.",
    })
    .email({
      message: "Email must be a valid email.",
    }),
});

export const ResetPasswordSchema = z
  .object({
    password: z
      .string({
        invalid_type_error: "Password must be a string.",
      })
      .min(6, {
        message: "Password is required.",
      }),
    confirmPassword: z
      .string({
        invalid_type_error: "Confirm password must be a string.",
      })
      .min(1, {
        message: "Confirm password is required.",
      }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
