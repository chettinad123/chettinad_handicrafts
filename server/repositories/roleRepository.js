import Role from '../model/Role.js';

const findByName = async (name) => {
    return await Role.findOne({ name });
};

const findById = async (id) => {
    return await Role.findById(id);
};

const createRole = async (roleData) => {
    const role = new Role(roleData);
    return await role.save();
};

const getAllRoles = async () => {
    return await Role.find();
};

export default {
    findByName,
    findById,
    createRole,
    getAllRoles,
};
