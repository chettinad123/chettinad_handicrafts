

import galleryService from "../services/galleryService.js";

const createGalleryImage = async (req, res) => {
    try {
        const { title, description, category, metaTitle, metaDescription } = req.body;

        const galleryImage = await galleryService.createGalleryImage({
            title,
            description,
            category,
            metaTitle,
            metaDescription,
            file: req.file,
        });

        return res.status(201).json({
            success: true,
            message: 'Gallery image has been posted successfully.',
            data: galleryImage,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};

const getAllGalleryImages = async (req, res) => {
    try {
        const { search, category, status, page, limit } = req.query;

        const result = await galleryService.getAllGalleryImages({ search, category, status, page, limit });

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

const getGalleryImageById = async (req, res) => {
    try {
        const { id } = req.params;

        const image = await galleryService.getGalleryImageById(id);

        return res.status(200).json({
            success: true,
            data: image,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};

const getGalleryImageBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const image = await galleryService.getGalleryImageBySlug(slug);

        return res.status(200).json({
            success: true,
            data: image,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};

const updateGalleryImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, status, metaTitle, metaDescription } = req.body;

        const image = await galleryService.updateGalleryImage(id, {
            title,
            description,
            category,
            status,
            metaTitle,
            metaDescription,
            file: req.file,
        });

        return res.status(200).json({
            success: true,
            message: 'Gallery image updated successfully',
            data: image,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};

const deleteGalleryImage = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await galleryService.deleteGalleryImage(id);

        return res.status(200).json({
            success: true,
            message: 'Gallery image deleted successfully',
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
    createGalleryImage,
    getAllGalleryImages,
    getGalleryImageById,
    getGalleryImageBySlug,
    updateGalleryImage,
    deleteGalleryImage,
};