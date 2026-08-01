import mongoose from 'mongoose';

const customOrderSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: true,
        },
        city: {
            type: String,
            required: true,
            trim: true,
        },
        state: {
            type: String,
            required: true,
            trim: true,
        },
        projectCategory: {
            type: String,
            required: true,
            trim: true,
        },
        projectType: {
            type: String,
            required: true,
            trim: true,
        },
        projectDescription: {
            type: String,
            required: true,
            trim: true,
        },
        referenceImageUrl: {
            type: String,
            default: '',
        },
        referenceImagePublicId: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            enum: ['new', 'in-progress', 'completed'],
            default: 'new',
        },
    },
    { timestamps: true }
);

const CustomOrder = mongoose.model('CustomOrder', customOrderSchema);

export default CustomOrder;