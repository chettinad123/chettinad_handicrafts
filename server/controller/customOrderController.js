

import customOrderService from "../services/customOrderService.js";

const createCustomOrder = async (req, res) => {
    try {
        const {
            customerName,
            phoneNumber,
            email,
            city,
            state,
            projectCategory,
            projectType,
            projectDescription,
        } = req.body;

        const order = await customOrderService.createCustomOrder({
            customerName,
            phoneNumber,
            email,
            city,
            state,
            projectCategory,
            projectType,
            projectDescription,
            file: req.file,
        });

        return res.status(201).json({
            success: true,
            message: 'Custom order submitted successfully',
            data: order,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};

const getAllCustomOrders = async (req, res) => {
    try {
        const { search, status, page, limit } = req.query;

        const result = await customOrderService.getAllCustomOrders({ search, status, page, limit });

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};

const getCustomOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await customOrderService.getCustomOrderById(id);

        return res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await customOrderService.updateStatus(id, status);

        return res.status(200).json({
            success: true,
            message: 'Status updated successfully',
            data: order,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};

const createAdminNotes = async (req, res) => {
    try {
        const { id } = req.params;
        const { adminNotes } = req.body;

        const customer = await customOrderService.createAdminNotes(id, adminNotes);

        return res.status(201).json({
            success: true,
            message: 'Admin notes created successfully',
            data: customer,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};

const updateAdminNotes = async (req, res) => {
    try {
        const { id } = req.params;
        const { adminNotes } = req.body;

        const order = await customOrderService.updateAdminNotes(id, adminNotes);

        return res.status(200).json({
            success: true,
            message: 'Admin notes saved successfully',
            data: order,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};

const getAdminNotes = async (req, res) => {
    try {
        const { id } = req.params;
        const notes = await customOrderService.getAdminNotes(id);

        return res.status(200).json({
            success: true,
            data: notes,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};

const deleteAdminNotes = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await customOrderService.deleteAdminNotes(id);

        return res.status(200).json({
            success: true,
            message: 'Admin notes deleted successfully',
            data: result,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};

const deleteCustomOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await customOrderService.deleteCustomOrder(id);

        return res.status(200).json({
            success: true,
            message: 'Custom order deleted successfully',
            data: result,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};

export default {
    createCustomOrder,
    getAllCustomOrders,
    getCustomOrderById,
    updateStatus,
    createAdminNotes,
    updateAdminNotes,
    getAdminNotes,
    deleteAdminNotes,
    deleteCustomOrder,
};