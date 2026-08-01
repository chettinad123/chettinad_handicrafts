

import authService from "../services/authService.js";

const register = async (req, res) => {
    try {
        const { username, name, email, password, address, role, permissions } = req.body;

        // Basic required field validation
        if (!username || !name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'username, name, email and password are required',
            });
        }

        // Username alphanumeric check (model layer layum irukku, idhu early check)
        if (!/^[a-zA-Z0-9]+$/.test(username)) {
            return res.status(400).json({
                success: false,
                message: 'Username should contain alphabets and numbers only',
            });
        }

        const result = await authService.registerUser({
            username,
            name,
            email,
            password,
            address,
            role,
            permissions,
        });

        return res.status(201).json({
            success: true,
            message: result.isFirstUser
                ? 'First user registered successfully as superAdmin'
                : 'User registered successfully',
            data: result,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};

const login = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // username or email anyone
        const identifier = username || email;

        const result = await authService.loginUser({ identifier, password });

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};

export default {
    register,
    login,
};
