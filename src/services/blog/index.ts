import { z } from "zod";

import { dataSource } from "@/data-source";
import { Blog } from "@/entities/blog";
import { User } from "@/entities/user";
import { CreateBlogSchema, UpdateBlogSchema } from "@/validation/schemas/blog";

const blogRepository = dataSource.getRepository(Blog);

export const countBlogs = async (search = "") => {
  let query = blogRepository.createQueryBuilder("blog");

  if (search) {
    query = query.where("blog.title like :search", { search: `%${search}%` });
  }

  return await query.getCount();
};

export const getBlogs = async (skip = 0, take = 10, search = "") => {
  let query = blogRepository.createQueryBuilder("blog");

  if (search) {
    query = query.where("blog.title like :search", { search: `%${search}%` });
  }

  return await query
    .leftJoinAndSelect("blog.user", "user")
    .skip(skip)
    .take(take)
    .getMany();
};

export const getBlogById = async (id: string) => {
  return await blogRepository.findOneBy({
    id,
  });
};

export const getBlogBySlug = async (slug: string) => {
  return await blogRepository
    .createQueryBuilder("blog")
    .where("blog.slug = :slug", { slug })
    .leftJoinAndSelect("blog.user", "user")
    .getOne();
};

export const createBlog = async (
  data: z.infer<typeof CreateBlogSchema>,
  user: User,
) => {
  return await blogRepository.save(
    blogRepository.create({
      ...data,
      user,
    }),
  );
};

export const updateBlog = async (
  data: z.infer<typeof UpdateBlogSchema>,
  blog: Blog,
) => {
  await blogRepository.update(blog.id, {
    ...data,
  });

  return await blogRepository.findOneBy({
    id: blog.id,
  });
};

export const deleteBlog = async (id: string) => {
  return await blogRepository
    .createQueryBuilder()
    .where("id = :id", { id })
    .softDelete()
    .execute();
};
