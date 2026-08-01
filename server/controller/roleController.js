import roleService from "../services/roleService.js";

// permissions can come dynamically body  e.g. ["user:create", "product:delete"]
const createRole = async (req, res) => {
    try {
        const { name, permissions } = req.body;

        const role = await roleService.createRole({ name, permissions });

        return res.status(201).json({
            success: true,
            message: 'Role created successfully',
            data: role,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};

const getAllRoles = async (req, res) => {
    try {
        const roles = await roleService.getAllRoles();

        return res.status(200).json({
            success: true,
            data: roles,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};

const updateRolePermissions = async (req, res) => {
    try {
        const { id } = req.params;
        const { permissions } = req.body;

        const role = await roleService.updateRolePermissions(id, permissions);

        return res.status(200).json({
            success: true,
            message: 'Role permissions updated successfully',
            data: role,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};

export default {
    createRole,
    getAllRoles,
    updateRolePermissions,
};
