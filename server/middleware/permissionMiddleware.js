// Usage: router.delete('/user/:id', protect, checkPermission('user', 'delete'), controller)
const checkPermission = (module, action) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized',
            });
        }

        const permissions = req.user.role.permissions || {};

        // superAdmin mathiri full access role ku { all: true } irukum
        const hasAccess = permissions.all === true || permissions?.[module]?.[action] === true;

        if (!hasAccess) {
            return res.status(403).json({
                success: false,
                message: `Access denied. '${module}:${action}' permission required`,
            });
        }

        next();
    };
};

export default checkPermission;
