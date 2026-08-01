
import GalleryImage from "../model/galleryImage.js";

const createGalleryImage = async (data) => {
    const galleryImage = new GalleryImage(data);
    return await galleryImage.save();
};

const findAll = async ({ search, category, status, page = 1, limit = 6 }) => {
    const query = {};

    if (search) {
        query.title = { $regex: search, $options: 'i' };
    }

    if (category && category !== 'All Categories') {
        query.category = category;
    }

    if (status && status !== 'All Status') {
        query.status = status;
    }

    const skip = (page - 1) * limit;

    const [images, total] = await Promise.all([
        GalleryImage.find(query)
            .populate('category')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        GalleryImage.countDocuments(query),
    ]);

    return { images, total };
};

const findById = async (id) => {
    return await GalleryImage.findById(id).populate('category');
};

const findBySlug = async (slug) => {
    return await GalleryImage.findOne({ slug, status: 'active' }).populate('category');
};

const updateById = async (id, data) => {
    return await GalleryImage.findByIdAndUpdate(id, data, { new: true }).populate('category');
};

const deleteById = async (id) => {
    return await GalleryImage.findByIdAndDelete(id);
};

export default {
    createGalleryImage,
    findAll,
    findById,
    findBySlug,
    updateById,
    deleteById,
};