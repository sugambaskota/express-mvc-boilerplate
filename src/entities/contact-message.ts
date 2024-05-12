import { Column, Entity } from "typeorm";

import { BaseModel } from "@/abstracts/base-model";

@Entity("contact_messages")
export class ContactMessage extends BaseModel {
  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column()
  address: string;

  @Column({
    nullable: true,
  })
  contactNumberPrefix: string;

  @Column()
  contactNumber: string;

  @Column()
  message: string;
}
