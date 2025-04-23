import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

//verifying the token
export const verifyToken = (req, res, next) => {

    //get the token from headers
    const authHeader =  req.headers.authorization;

    if( !authHeader || !authHeader.startsWith('Bearer ') ) {
        return res.status(401).json({ message : 'No token provided.' });

    }

    const token = authHeader.split(' ')[1];

    try {
        //verify and decode the token using your secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //attach user info from the token to request object
        req.user = decoded;

        next();
    }
    catch (err) {
        return res.status(401).json({ message : 'invalid or expired token' });
    }
};

//admin only route
export const isAdmin = (req, res, next) => {

    if(req.user.role !== 'admin') {
        return res.status(403).json({ message : 'access denied. Admins only' });
    }
    
    next();
};

//to allow access to specified roles
export const requireRole = (role) => {
    return (req, res, next) => {

        if(req.user.role !== role) {
            return res.status(403).json({ message : `Access only allowed for ${role}` });
        }
        next();
    };
};
