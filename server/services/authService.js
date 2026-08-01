
import roleRepository from '../repositories/roleRepository.js';
import userRepository from '../repositories/userRepository.js';
import generateToken from '../utils/generateToken.js';

const SUPER_ADMIN_ROLE = 'superAdmin';

// superAdmin role irukka nu check, illana create pannurom
// permissions dynamic ah client anupinaalum aakum (object format), illana { all: true } default (full access)
const getOrCreateSuperAdminRole = async (permissions) => {
    let role = await roleRepository.findByName(SUPER_ADMIN_ROLE);

    if (!role) {
        role = await roleRepository.createRole({
            name: SUPER_ADMIN_ROLE,
            permissions:
                permissions && typeof permissions === 'object' && Object.keys(permissions).length
                    ? permissions
                    : { all: true },
            isSystemRole: true,
        });
        console.log('superAdmin role created');
    }

    return role;
};

const registerUser = async ({ username, name, email, password, address, role, permissions }) => {
    // Username / email already irukka nu check pannurom
    const existingUser = await userRepository.findByEmailOrUsernameExists(username, email);
    if (existingUser) {
        const error = new Error('Username or Email already exists');
        error.statusCode = 409;
        throw error;
    }

    // Idhu first user aa nu check pannurom (DB la yaaru illa)
    const userCount = await userRepository.countUsers();
    const isFirstUser = userCount === 0;

    let assignedRole;

    if (isFirstUser) {
        // First user eppovume superAdmin -> submit panna role field ah ignore pannurom
        assignedRole = await getOrCreateSuperAdminRole(permissions);
    } else {
        // Role field kandippa venum, adhu valid role ah irukanum (id or name rendaiyum accept pannurom)
        if (!role) {
            const error = new Error('Role is required');
            error.statusCode = 400;
            throw error;
        }

        assignedRole = await roleRepository.findById(role).catch(() => null);
        if (!assignedRole) {
            assignedRole = await roleRepository.findByName(role);
        }

        if (!assignedRole) {
            const error = new Error('Invalid role provided');
            error.statusCode = 400;
            throw error;
        }
    }

    const user = await userRepository.createUser({
        username,
        name,
        email,
        password,
        address,
        role: assignedRole._id,
    });

    const token = generateToken(user._id);

    return {
        token,
        user: {
            id: user._id,
            username: user.username,
            name: user.name,
            email: user.email,
            address: user.address,
            role: assignedRole.name,
            permissions: assignedRole.permissions,
        },
        isFirstUser,
    };
};

const loginUser = async ({ identifier, password }) => {
    // identifier -> username or email, edhavadhu ondru match aagum
    if (!identifier || !password) {
        const error = new Error('Username/Email and password are required');
        error.statusCode = 400;
        throw error;
    }

    const user = await userRepository.findByUsernameOrEmail(identifier);
    if (!user) {
        const error = new Error('Invalid credentials');
        error.statusCode = 401;
        throw error;
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        const error = new Error('Invalid credentials');
        error.statusCode = 401;
        throw error;
    }

    const token = generateToken(user._id);

    return {
        token,
        user: {
            id: user._id,
            username: user.username,
            name: user.name,
            email: user.email,
            role: user.role.name,
            permissions: user.role.permissions,
        },
    };
};

export default {
    registerUser,
    loginUser,
};
