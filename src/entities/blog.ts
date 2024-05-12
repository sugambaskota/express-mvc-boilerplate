import { Column, Entity, Index, ManyToOne } from "typeorm";

import { BaseModelWithSeo } from "@/abstracts/base-model-with-seo";
import { User } from "./user";

@Entity("blogs")
export class Blog extends BaseModelWithSeo {
  @Column()
  title: string;

  @Index("slugIndex")
  @Column()
  slug: string;

  @Column()
  thumbImage: string;

  @Column()
  image: string;

  @Column()
  shortDescription: string;

  @Column({
    type: "text",
  })
  description: string;

  @Column()
  isPublished: boolean;

  @ManyToOne(() => User, (user) => user.blogs, {
    nullable: false,
  })
  user: User;
}
