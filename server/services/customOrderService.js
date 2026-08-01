
import cloudinary from "../config/cloudinary.js";
import customerRepository from "../repositories/customerRepository.js";
import customOrderRepository from "../repositories/customOrderRepository.js";

const ALLOWED_STATUSES = ['new', 'in-progress', 'completed'];

const createCustomOrder = async ({
    customerName,
    phoneNumber,
    email,
    city,
    state,
    projectCategory,
    projectType,
    projectDescription,
    file,
}) => {
    if (
        !customerName ||
        !phoneNumber ||
        !email ||
        !city ||
        !state ||
        !projectCategory ||
        !projectType ||
        !projectDescription
    ) {
        const error = new Error('All fields are required except reference image');
        error.statusCode = 400;
        throw error;
    }

    const customer = await customerRepository.findOrCreate({
        name: customerName,
        phoneNumber,
        email,
    });

    const order = await customOrderRepository.createCustomOrder({
        customer: customer._id,
        city,
        state,
        projectCategory,
        projectType,
        projectDescription,
        referenceImageUrl: file ? file.path : '',
        referenceImagePublicId: file ? file.filename : '',
    });

    return order;
};

const getAllCustomOrders = async ({ search, status, page, limit }) => {
    const { orders, total } = await customOrderRepository.findAll({ search, status, page, limit });

    return {
        orders: orders.map((o) => ({
            id: o._id,
            customerName: o.customer.name,
            projectCategory: o.projectCategory,
            projectType: o.projectType,
            location: `${o.city}, ${o.state}`,
            status: o.status,
            createdAt: o.createdAt,
        })),
        total,
        page: Number(page) || 1,
        limit: Number(limit) || 9,
        totalPages: Math.ceil(total / (Number(limit) || 9)),
    };
};

const getCustomOrderById = async (id) => {
    const order = await customOrderRepository.findById(id);
    if (!order) {
        const error = new Error('Custom order not found');
        error.statusCode = 404;
        throw error;
    }

    return order;
};

const updateStatus = async (id, status) => {
    if (!ALLOWED_STATUSES.includes(status)) {
        const error = new Error(`Invalid status. Allowed values: ${ALLOWED_STATUSES.join(', ')}`);
        error.statusCode = 400;
        throw error;
    }

    const order = await customOrderRepository.updateById(id, { status });
    if (!order) {
        const error = new Error('Custom order not found');
        error.statusCode = 404;
        throw error;
    }

    return order;
};

// CREATE - first time note add pannuradhu. Already note irundha error tharum.
const createAdminNotes = async (orderId, adminNotes) => {
    const order = await customOrderRepository.findById(orderId);
    if (!order) {
        const error = new Error('Custom order not found');
        error.statusCode = 404;
        throw error;
    }

    if (order.customer.adminNotes && order.customer.adminNotes.trim() !== '') {
        const error = new Error('Admin notes already exist for this customer. Use update instead.');
        error.statusCode = 409;
        throw error;
    }

    const updatedCustomer = await customerRepository.updateNotes(order.customer._id, adminNotes);

    return updatedCustomer;
};

// UPDATE - already irukra note ah edit pannuradhu
const updateAdminNotes = async (orderId, adminNotes) => {
    const order = await customOrderRepository.findById(orderId);
    if (!order) {
        const error = new Error('Custom order not found');
        error.statusCode = 404;
        throw error;
    }

    const updatedCustomer = await customerRepository.updateNotes(order.customer._id, adminNotes);

    return updatedCustomer;
};

// GET - order id vachi, andha customer oda notes mattum fetch pannuradhu
const getAdminNotes = async (orderId) => {
    const order = await customOrderRepository.findById(orderId);
    if (!order) {
        const error = new Error('Custom order not found');
        error.statusCode = 404;
        throw error;
    }

    return {
        customerId: order.customer._id,
        adminNotes: order.customer.adminNotes || '',
    };
};

// DELETE - notes ah clear pannuradhu (empty string ah set pannurom)
const deleteAdminNotes = async (orderId) => {
    const order = await customOrderRepository.findById(orderId);
    if (!order) {
        const error = new Error('Custom order not found');
        error.statusCode = 404;
        throw error;
    }

    const updatedCustomer = await customerRepository.updateNotes(order.customer._id, '');

    return updatedCustomer;
};

const deleteCustomOrder = async (id) => {
    const order = await customOrderRepository.findById(id);
    if (!order) {
        const error = new Error('Custom order not found');
        error.statusCode = 404;
        throw error;
    }

    if (order.referenceImagePublicId) {
        await cloudinary.uploader.destroy(order.referenceImagePublicId);
    }

    await customOrderRepository.deleteById(id);

    return { deleted: true };
};

export default {
    createCustomOrder,
    getAllCustomOrders,
    getCustomOrderById,
    updateStatus,
    createAdminNotes,
    updateAdminNotes,
    getAdminNotes,
    deleteAdminNotes,
    deleteCustomOrder,
};