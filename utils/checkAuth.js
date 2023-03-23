import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, 'secret');
        req.userId = decoded._id;
        next();
    } catch (e) {
        console.log(e);
        res.status(401).json({message: 'Нет доступа'});
    }
}