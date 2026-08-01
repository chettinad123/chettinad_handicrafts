import mongoose from 'mongoose';

const galleryImageSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true, // SEO-friendly URL ku, e.g. /gallery/teak-wood-carved-door
            trim: true,
            lowercase: true,
            index: true,
        },
        imageUrl: {
            type: String,
            required: true, // Cloudinary secure_url
        },
        imagePublicId: {
            type: String,
            required: true, // Cloudinary public_id -> delete/replace panna venum
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 160,
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
        metaTitle: {
            type: String,
            trim: true,
            default: '',
        },
        metaDescription: {
            type: String,
            trim: true,
            default: '',
        },
    },
    { timestamps: true }
);

const GalleryImage = mongoose.model('GalleryImage', galleryImageSchema);

export default GalleryImage;