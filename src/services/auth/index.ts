import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { dataSource } from "@/data-source";
import { User } from "@/entities/user";
import {
  PatchUserSchema,
  RegisterUserSchema,
  ResetPasswordSchema,
  UpdatePasswordSchema,
} from "@/validation/schemas/auth";

const userRepository = dataSource.getRepository(User);

export const registerUser = async (
  data: z.infer<typeof RegisterUserSchema>,
) => {
  const user = await userRepository.save(
    userRepository.create({
      ...data,
      password: await User.hashPassword(data.password),
      verificationToken: uuidv4(),
    }),
  );

  return user;
};

export const getUserById = async (id: string) => {
  return await userRepository.findOneBy({
    id,
  });
};

export const getUserByEmail = async (email: string) => {
  return await userRepository.findOneBy({
    email,
  });
};

export const getUserByEmailWithHashedPassword = async (email: string) => {
  return await userRepository
    .createQueryBuilder("user")
    .where("user.email = :email", { email })
    .addSelect(["user.password"])
    .getOne();
};

export const getUserByEmailWithVerificationToken = async (email: string) => {
  return await userRepository
    .createQueryBuilder("user")
    .where("user.email = :email", { email })
    .addSelect(["user.verificationToken"])
    .getOne();
};

export const getUserByEmailWithPasswordResetToken = async (email: string) => {
  return await userRepository
    .createQueryBuilder("user")
    .where("user.email = :email", { email })
    .addSelect(["user.passwordResetToken"])
    .getOne();
};

export const getUserProfile = async (id: string) => {
  return await userRepository.findOneBy({
    id,
  });
};

export const patchUser = async (
  patchUserSchema: z.infer<typeof PatchUserSchema>,
  user: User,
) => {
  return await userRepository.update(user.id, patchUserSchema);
};

export const verifyEmail = async (user: User) => {
  user.verified = true;
  user.verificationToken = null;

  return await user.save();
};

export const updatePassword = async (
  updatePasswordSchema: z.infer<typeof UpdatePasswordSchema>,
  user: User,
) => {
  return await userRepository.update(user.id, {
    password: await User.hashPassword(updatePasswordSchema.newPassword),
  });
};

export const generatePasswordResetToken = async (user: User) => {
  const passwordResetToken = uuidv4();
  user.passwordResetToken = passwordResetToken;

  return await user.save();
};

export const resetPassword = async (
  resetPasswordSchema: z.infer<typeof ResetPasswordSchema>,
  user: User,
) => {
  return await userRepository.update(user.id, {
    passwordResetToken: null,
    password: await User.hashPassword(resetPasswordSchema.password),
  });
};
