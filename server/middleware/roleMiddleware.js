// Usage: router.delete('/user/:id', protect, authorize('superAdmin', 'admin'), controller)
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized',
            });
        }

        if (!allowedRoles.includes(req.user.role.name)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role: ${allowedRoles.join(' or ')}`,
            });
        }

        next();
    };
};

export default authorize;
