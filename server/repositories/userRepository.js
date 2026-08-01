import User from '../model/User.js';

const countUsers = async () => {
    return await User.countDocuments();
};

const findByUsernameOrEmail = async (identifier) => {
    return await User.findOne({
        $or: [{ username: identifier }, { email: identifier }],
    }).populate('role');
};

const findByEmailOrUsernameExists = async (username, email) => {
    return await User.findOne({ $or: [{ username }, { email }] });
};

const createUser = async (userData) => {
    const user = new User(userData);
    return await user.save();
};

const findById = async (id) => {
    return await User.findById(id).populate('role');
};

export default {
    countUsers,
    findByUsernameOrEmail,
    findByEmailOrUsernameExists,
    createUser,
    findById,
};
