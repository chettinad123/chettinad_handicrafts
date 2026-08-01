

import CustomOrder from '../model/customOrder.js';

const createCustomOrder = async (data) => {
    const order = new CustomOrder(data);
    return await order.save();
};

const findAll = async ({ search, status, page = 1, limit = 9 }) => {
    const query = {};

    if (status && status !== 'All Status') {
        query.status = status;
    }

    const skip = (page - 1) * limit;

    if (search) {
        const Customer = (await import('../model/Customer.js')).default;
        const matchingCustomers = await Customer.find({
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phoneNumber: { $regex: search, $options: 'i' } },
            ],
        }).select('_id');

        query.customer = { $in: matchingCustomers.map((c) => c._id) };
    }

    const [orders, total] = await Promise.all([
        CustomOrder.find(query).populate('customer').sort({ createdAt: -1 }).skip(skip).limit(limit),
        CustomOrder.countDocuments(query),
    ]);

    return { orders, total };
};

const findById = async (id) => {
    return await CustomOrder.findById(id).populate('customer');
};

const updateById = async (id, data) => {
    return await CustomOrder.findByIdAndUpdate(id, data, { new: true }).populate('customer');
};

const deleteById = async (id) => {
    return await CustomOrder.findByIdAndDelete(id);
};

export default {
    createCustomOrder,
    findAll,
    findById,
    updateById,
    deleteById,
};