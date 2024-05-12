import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export abstract class BaseModelWithSeo extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({
    select: false,
  })
  deletedAt: Date;

  @Column({
    type: "text",
    nullable: true,
  })
  metaTitle: string;

  @Column({
    type: "text",
    nullable: true,
  })
  metaDescription: string;

  @Column({
    type: "text",
    nullable: true,
  })
  metaKeywords: string;

  @Column({
    type: "text",
    nullable: true,
  })
  metaTags: string;

  @Column({
    type: "text",
    nullable: true,
  })
  socialTitle: string;

  @Column({
    type: "text",
    nullable: true,
  })
  socialDescription: string;

  @Column({
    type: "text",
    nullable: true,
  })
  socialUrl: string;

  @Column({
    type: "text",
    nullable: true,
  })
  socialImage: string;
}
