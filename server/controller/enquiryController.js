import enquiryService from "../services/enquiryService.js";


const updateStatus = async (req, res) => {
  try {
    const enquiry = await enquiryService.updateStatus(req.params.id, req.body.status);

    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: enquiry,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const create = async (req, res) => {
  try {
    const enquiry = await enquiryService.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      data: enquiry,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAll = async (req, res) => {
  try {
    const enquiries = await enquiryService.getAll();

    return res.status(200).json({
      success: true,
      data: enquiries,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getById = async (req, res) => {
  try {
    const enquiry = await enquiryService.getById(req.params.id);

    return res.status(200).json({
      success: true,
      data: enquiry,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const remove = async (req, res) => {
  try {
    await enquiryService.remove(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  create,
  getAll,
  getById,
    updateStatus,
  remove,
};