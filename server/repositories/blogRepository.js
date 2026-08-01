import Blog from "../model/blogModel.js";

const create = async (data) => {
  return Blog.create(data);
};

const findAll = async () => {
  return Blog.find()
    .populate("createdBy", "name email role")
    .sort({ createdAt: -1 });
};

const findById = async (id) => {
  return Blog.findById(id).populate(
    "createdBy",
    "name email role"
  );
};

const update = async (id, data) => {
  const blog = await Blog.findById(id);
  if (!blog) return null;

  Object.assign(blog, data);
  return blog.save();
};

const deleteBlog = async (id) => {
  return Blog.findByIdAndDelete(id);
};

export default {
  create,
  findAll,
  findById,
  update,
  deleteBlog,
};