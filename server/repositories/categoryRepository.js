import Category from '../model/Category.js';

const findByName = async (name) => {
    return await Category.findOne({ name });
};

const createCategory = async (data) => {
    const category = new Category(data);
    return await category.save();
};

const getAllCategories = async () => {
    return await Category.find().sort({ name: 1 });
};

export default {
    findByName,
    createCategory,
    getAllCategories,
};