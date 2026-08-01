import Customer from '../model/Customer.js';

const findByEmail = async (email) => {
    return await Customer.findOne({ email });
};

const findById = async (id) => {
    return await Customer.findById(id);
};

const createCustomer = async (data) => {
    const customer = new Customer(data);
    return await customer.save();
};

const findOrCreate = async ({ name, phoneNumber, email }) => {
    let customer = await findByEmail(email);

    if (!customer) {
        customer = await createCustomer({ name, phoneNumber, email });
    }

    return customer;
};

const updateNotes = async (id, adminNotes) => {
    return await Customer.findByIdAndUpdate(id, { adminNotes }, { new: true });
};

export default {
    findByEmail,
    findById,
    createCustomer,
    findOrCreate,
    updateNotes,
};