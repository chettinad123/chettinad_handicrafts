
import categoryService from "../services/categoryService.js";

const createCategory = async (req, res) => {
    try {
        const { name,description } = req.body;
        const category = await categoryService.createCategory({ name,description });

        return res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();

        return res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};

export default {
    createCategory,
    getAllCategories,
};