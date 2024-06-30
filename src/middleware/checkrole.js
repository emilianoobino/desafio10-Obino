export default function checkUserRole(allowedRoles) {
    return function (req, res, next) {
        // Verifica si el usuario está autenticado
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: "No autorizado" });
        }

        // Verifica si el rol del usuario está permitido
        const userRole = req.user.role;
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: "Acceso denegado" });
        }

        // Si el rol está permitido, continúa con la siguiente función middleware
        next();
    }
}

