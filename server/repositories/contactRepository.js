import Contact from "../model/contactModel.js";

const create = async (data) => {
  return Contact.create(data);
};

const findAll = async () => {
  return Contact.find().sort({ createdAt: -1 });
};

const findById = async (id) => {
  return Contact.findById(id);
};

const remove = async (id) => {
  return Contact.findByIdAndDelete(id);
};

const updateStatus = async (id, status) => {
  return Contact.findByIdAndUpdate(id, { status }, { new: true });
};

export default {
  create,
  findAll,
  findById,
  updateStatus,
  remove,
};