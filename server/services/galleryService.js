

import cloudinary from "../config/cloudinary.js";
import GalleryImage from "../model/galleryImage.js";
import galleryRepository from "../repositories/galleryRepository.js";
import { generateUniqueSlug } from "../utils/generateSlug.js";

const createGalleryImage = async ({ title, description, category, metaTitle, metaDescription, file }) => {
    if (!title || !description || !category) {
        const error = new Error('Title, description and category are required');
        error.statusCode = 400;
        throw error;
    }

    if (!file) {
        const error = new Error('Image is required');
        error.statusCode = 400;
        throw error;
    }

    const slug = await generateUniqueSlug(title, GalleryImage);

    const galleryImage = await galleryRepository.createGalleryImage({
        title,
        slug,
        description,
        category,
        imageUrl: file.path,
        imagePublicId: file.filename,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || description,
    });

    return galleryImage;
};

const getAllGalleryImages = async ({ search, category, status, page = 1, limit = 6 }) => {
    const { images, total } = await galleryRepository.findAll({
        search,
        category,
        status,
    });

    const currentPage = Number(page) || 1;
    const currentLimit = Number(limit) || 6;

    return {
        images,
        total,
        page: currentPage,
        limit: currentLimit,
        totalPages: Math.ceil(total / currentLimit),
    };
};

const getGalleryImageById = async (id) => {
    const image = await galleryRepository.findById(id);
    if (!image) {
        const error = new Error('Gallery image not found');
        error.statusCode = 404;
        throw error;
    }

    return image;
};

const getGalleryImageBySlug = async (slug) => {
    const image = await galleryRepository.findBySlug(slug);
    if (!image) {
        const error = new Error('Gallery image not found');
        error.statusCode = 404;
        throw error;
    }

    return image;
};

const updateGalleryImage = async (id, { title, description, category, status, metaTitle, metaDescription, file }) => {
    const existing = await galleryRepository.findById(id);
    if (!existing) {
        const error = new Error('Gallery image not found');
        error.statusCode = 404;
        throw error;
    }

    const updateData = {};

    if (title && title !== existing.title) {
        updateData.title = title;
        updateData.slug = await generateUniqueSlug(title, GalleryImage, id);
    }

    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (status) updateData.status = status;
    if (metaTitle) updateData.metaTitle = metaTitle;
    if (metaDescription) updateData.metaDescription = metaDescription;

    if (file) {
        if (existing.imagePublicId) {
            await cloudinary.uploader.destroy(existing.imagePublicId);
        }
        updateData.imageUrl = file.path;
        updateData.imagePublicId = file.filename;
    }

    const updated = await galleryRepository.updateById(id, updateData);

    return updated;
};

const deleteGalleryImage = async (id) => {
    const image = await galleryRepository.findById(id);
    if (!image) {
        const error = new Error('Gallery image not found');
        error.statusCode = 404;
        throw error;
    }

    if (image.imagePublicId) {
        await cloudinary.uploader.destroy(image.imagePublicId);
    }

    await galleryRepository.deleteById(id);

    return { deleted: true };
};

export default {
    createGalleryImage,
    getAllGalleryImages,
    getGalleryImageById,
    getGalleryImageBySlug,
    updateGalleryImage,
    deleteGalleryImage,
};