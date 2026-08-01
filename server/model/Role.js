import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true, // Example: "superAdmin", "admin", "editor"
        },
        permissions: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
            // Example:
            // {
            //   user: { create: true, read: true, update: false, delete: false },
            //   product: { create: true, read: true, update: true, delete: false }
            // }
        },
        isSystemRole: {
            type: Boolean,
            default: false, // superAdmin -> true, cannot delete
        },
    },
    { timestamps: true }
);

const Role = mongoose.model('Role', roleSchema);

export default Role;
