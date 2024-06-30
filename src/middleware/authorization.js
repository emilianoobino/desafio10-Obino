function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).send('Prohibido: Solo Admin.');
    }
}

function isUser(req, res, next) {
    if (req.user && req.user.role === 'user') {
        next();
    } else {
        res.status(403).send('Prohibido: Solo User.');
    }
}


export { isAdmin, isUser };