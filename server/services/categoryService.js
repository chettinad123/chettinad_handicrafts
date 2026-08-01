
import categoryRepository from "../repositories/categoryRepository.js";

const createCategory = async ({ name,description }) => {
    if (!name) {
        const error = new Error('Category name is required');
        error.statusCode = 400;
        throw error;
    }

    const existing = await categoryRepository.findByName(name);
    if (existing) {
        const error = new Error('Category already exists');
        error.statusCode = 409;
        throw error;
    }

    return await categoryRepository.createCategory({ name,description });
};

const getAllCategories = async () => {
    return await categoryRepository.getAllCategories();
};

export default {
    createCategory,
    getAllCategories,
};