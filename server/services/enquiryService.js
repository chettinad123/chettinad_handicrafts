import enquiryRepository from "../repositories/enquiryRepository.js";

const ALLOWED_STATUSES = ["new", "read", "responded"];

const updateStatus = async (id, status) => {
  if (!ALLOWED_STATUSES.includes(status)) {
    const error = new Error(`Invalid status. Allowed values: ${ALLOWED_STATUSES.join(", ")}`);
    error.statusCode = 400;
    throw error;
  }

  const enquiry = await enquiryRepository.findById(id);
  if (!enquiry) {
    const error = new Error("Enquiry not found");
    error.statusCode = 404;
    throw error;
  }

  return enquiryRepository.updateStatus(id, status);
};

const create = async (data) => {
  return enquiryRepository.create(data);
};

const getAll = async () => {
  return enquiryRepository.findAll();
};

const getById = async (id) => {
  const enquiry = await enquiryRepository.findById(id);

  if (!enquiry) {
    throw new Error("Enquiry not found");
  }

  return enquiry;
};

const remove = async (id) => {
  const enquiry = await enquiryRepository.findById(id);

  if (!enquiry) {
    throw new Error("Enquiry not found");
  }

  return enquiryRepository.remove(id);
};

export default {
  create,
  getAll,
  getById,
  updateStatus,
  remove,
};