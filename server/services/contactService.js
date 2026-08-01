import contactRepository from "../repositories/contactRepository.js";

const create = async (data) => {
  return await contactRepository.create(data);
};

const getAll = async () => {
  return await contactRepository.findAll();
};

const getById = async (id) => {
  const contact = await contactRepository.findById(id);

  if (!contact) {
    throw new Error("Contact not found");
  }

  return contact;
};

const remove = async (id) => {
  const contact = await contactRepository.findById(id);

  if (!contact) {
    throw new Error("Contact not found");
  }

  return await contactRepository.remove(id);
};

const ALLOWED_STATUSES = ["new", "read", "responded"];

const updateStatus = async (id, status) => {
  if (!ALLOWED_STATUSES.includes(status)) {
    const error = new Error(`Invalid status. Allowed values: ${ALLOWED_STATUSES.join(", ")}`);
    error.statusCode = 400;
    throw error;
  }

  const contact = await contactRepository.findById(id);
  if (!contact) {
    const error = new Error("Contact not found");
    error.statusCode = 404;
    throw error;
  }

  return contactRepository.updateStatus(id, status);
};

export default {
  create,
  getAll,
  getById,
  updateStatus, 
  remove,
};