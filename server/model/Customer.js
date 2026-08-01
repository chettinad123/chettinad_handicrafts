import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        phoneNumber: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
        },
        adminNotes: {
            type: String,
            trim: true,
            default: '',
        },
    },
    { timestamps: true }
);

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;