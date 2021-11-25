const jwt = require('jsonwebtoken');
const User = require('../models/user');

verifyToken = (req, res, next) => {
    const authHeader = req.get('Authorization');
    console.log(authHeader);
    if(!authHeader) {
        const error = new Error('Not authenticated.');
        err.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'liSenseAppEngineerSecret');
    } catch(err) {
        err.statusCode = 500;
        throw err;
    } if(!decodedToken) {
        const error = new Error('Not authenticated.');
        err.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    req.userRole = decodedToken.role;
    // if(!token) {
    //     return res.status(403).send({message: 'No token provided.'});
    // }
    // jwt.verify(token, 'liSenseAppEngineerSecret', (err, decodedToken) => {
    //     if(err) {
    //         return res.status(401).send({message: 'Not authorized.'});
    //     }
    //     req.userId = decodedToken.userId;
    //     req.userRole = decodedToken.role;
    // })
   // req.userRole = decodedToken.role //I will use it for authorizing access, I know user id stored in token
    next();
}

isOwner = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        if(user.role === 'owner') {
            next();
            return;
        }
        res.status(403).send({
            message: "Require owner role."
        });
        return;
    })
}

isInstructor = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        if(user.role === 'instructor') {
            next();
            return;
        }
        res.status(403).send({
            message: "Require instructor role."
        });
        return;
    })
}

isStudent = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        if(user.role === 'student') {
            next();
            return;
        }
        res.status(403).send({
            message: "Require student role."
        });
        return;
    })
}

const authJwt = {
    verifyToken: verifyToken,
    isOwner: isOwner,
    isInstructor: isInstructor,
    isStudent: isStudent
};

module.exports = authJwt;