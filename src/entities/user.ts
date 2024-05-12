import * as bcrypt from "bcryptjs";
import { Column, Entity, Index, OneToMany } from "typeorm";

import { BaseModel } from "@/abstracts/base-model";
import { UserRoles } from "@/constants/user-roles";
import { Blog } from "./blog";

@Entity("users")
export class User extends BaseModel {
  @Index("emailIndex")
  @Column()
  email: string;

  @Column({
    select: false,
  })
  password: string;

  @Column()
  fullName: string;

  @Column({
    nullable: true,
  })
  image: string;

  @Column({
    default: false,
  })
  verified: boolean;

  @Column({
    nullable: true,
    select: false,
  })
  verificationToken: string;

  @Column({
    nullable: true,
    select: false,
  })
  passwordResetToken: string;

  @Column({
    type: "enum",
    enum: UserRoles,
    default: UserRoles.USER,
  })
  role: UserRoles;

  @OneToMany(() => Blog, (blog) => blog.user)
  blogs: Blog[];

  static async hashPassword(password: string) {
    return await bcrypt.hash(password, 12);
  }

  static async comparePasswords(
    candidatePassword: string,
    hashedPassword: string,
  ) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}
