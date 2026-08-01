import blogRepository from "../repositories/blogRepository.js";
import cloudinary from "../config/cloudinary.js";

const create = async (data, user) => {
  const blog = await blogRepository.create({
    ...data,
    createdBy: user.id,
  });

  return blog;
};

const getAll = async () => {
  return await blogRepository.findAll();
};

const getById = async (id) => {
  const blog = await blogRepository.findById(id);

  if (!blog) {
    throw new Error("Blog not found");
  }

  return blog;
};

// Helper: blog.createdBy may come back either as a raw ObjectId or, since
// blogRepository.findById() runs .populate("createdBy", "name email role"),
// as a full populated user object ({ _id, name, email, role }). Normalize
// both shapes to a plain string id before comparing.
const resolveCreatedById = (createdBy) => {
  if (!createdBy) return null;
  return (createdBy._id || createdBy).toString();
};

const update = async (id, data, user) => {
  const blog = await blogRepository.findById(id);

  if (!blog) {
    throw new Error("Blog not found");
  }

  const userId = (user.id || user._id)?.toString();
  const createdById = resolveCreatedById(blog.createdBy);
  const isOwner = createdById === userId;
  const isElevated = user.role === "superAdmin" || user.role === "admin";

  if (!isOwner && !isElevated) {
    throw new Error("Not authorized to update");
  }

  const payload = { ...data };

  if (typeof payload.tags === "string") {
    payload.tags = JSON.parse(payload.tags || "[]");
  }

  if (typeof payload.content === "string") {
    payload.content = JSON.parse(payload.content || "[]");
  }

  return blogRepository.update(id, payload);
};

const remove = async (id, user) => {
  const blog = await blogRepository.findById(id);

  if (!blog) {
    throw new Error("Blog not found");
  }

  const userId = (user.id || user._id)?.toString();
  const createdById = resolveCreatedById(blog.createdBy);
  const isOwner = createdById === userId;
  const isElevated = user.role === "superAdmin" || user.role === "admin";

  if (!isOwner && !isElevated) {
    throw new Error("Not authorized to delete");
  }

  if (blog.heroimage?.publicId) {
    await cloudinary.uploader.destroy(blog.heroimage.publicId);
  }

  if (blog.content?.length) {
    for (const block of blog.content) {
      if (block.type === "image" && block.imageurl?.publicId) {
        await cloudinary.uploader.destroy(block.imageurl.publicId);
      }
    }
  }

  await blogRepository.deleteBlog(id);

  return true;
};

export default {
  create,
  getAll,
  getById,
  update,
  remove,
};