import roleRepository from "../repositories/roleRepository.js";

const createRole = async ({ name, permissions }) => {
    if (!name) {
        const error = new Error('Role name is required');
        error.statusCode = 400;
        throw error;
    }

    const existing = await roleRepository.findByName(name);
    if (existing) {
        const error = new Error('Role already exists');
        error.statusCode = 409;
        throw error;
    }

    // permissions kudukalana empty object, illana whatever object client anupura adhe vechikom
    const role = await roleRepo.createRole({
        name,
        permissions: permissions && typeof permissions === 'object' ? permissions : {},
    });

    return role;
};

const getAllRoles = async () => {
    return await roleRepo.getAllRoles();
};

const updateRolePermissions = async (roleId, permissions) => {
    const role = await roleRepo.findById(roleId);
    if (!role) {
        const error = new Error('Role not found');
        error.statusCode = 404;
        throw error;
    }

    role.permissions = permissions && typeof permissions === 'object' ? permissions : role.permissions;
    await role.save();

    return role;
};

export default {
    createRole,
    getAllRoles,
    updateRolePermissions,
};
