import { z } from "zod";

import { dataSource } from "@/data-source";
import { ContactMessage } from "@/entities/contact-message";
import { CreateContactMessageSchema } from "@/validation/schemas/contact-message";

const contactMessageRepository = dataSource.getRepository(ContactMessage);

export const countContactMessages = async (search = "") => {
  let query = contactMessageRepository.createQueryBuilder("contactMessage");

  if (search) {
    query = query.where("contactMessage.fullName like :search", {
      search: `%${search}%`,
    });
  }

  return await query.getCount();
};

export const getContactMessages = async (skip = 0, take = 10, search = "") => {
  let query = contactMessageRepository.createQueryBuilder("contactMessage");

  if (search) {
    query = query.where("contactMessage.fullName like :search", {
      search: `%${search}%`,
    });
  }

  return await query.skip(skip).take(take).getMany();
};

export const getContactMessageById = async (id: string) => {
  return await contactMessageRepository.findOneBy({
    id,
  });
};

export const createContactMessage = async (
  data: z.infer<typeof CreateContactMessageSchema>,
) => {
  return await contactMessageRepository.save(
    contactMessageRepository.create({
      ...data,
    }),
  );
};

export const deleteContactMessage = async (id: string) => {
  return await contactMessageRepository
    .createQueryBuilder()
    .where("id = :id", { id })
    .delete()
    .execute();
};
