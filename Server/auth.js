'use strict';

const jwt = require('jsonwebtoken');

/**
 * Authentication middleware
 */
module.exports = function(req, res, next) {    
    try {
        let token = req.headers.authorization.replace(/Bearer /ig, "");
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.data;
        next();
    } catch (e) {
        // JWT decode error, throw error
        res.status(400).json({
            detail: "Invalid auth token provided.",
            status:400
        });
    }
};