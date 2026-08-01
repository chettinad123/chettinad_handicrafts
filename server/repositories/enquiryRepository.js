import Enquiry from "../model/enquiryModel.js";

const create = async (data) => {
  return Enquiry.create(data);
};

const findAll = async () => {
  return Enquiry.find().sort({ createdAt: -1 });
};

const findById = async (id) => {
  return Enquiry.findById(id);
};

const remove = async (id) => {
  return Enquiry.findByIdAndDelete(id);
};

const updateStatus = async (id, status) => {
  return Enquiry.findByIdAndUpdate(id, { status }, { new: true });
};

export default {
  create,
  findAll,
  findById,
  updateStatus,
  remove,
};