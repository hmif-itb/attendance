/**
 * Authentication route
 */

let express = require('express');
let jwt = require('jsonwebtoken');
let router = express.Router();
const users = require('../datastore/users');
const bcrypt = require('bcrypt');

/**
 * Authenticate user and generate JWT
 */
router.post('/login', async (req,res)=>{
    let username = req.body.username;
    let password = req.body.password;

    let user = await users.get(username);

    if(!user) {
        res.status(403).json({
            detail: "Invalid username and/or password",
            status:403
        });
        return;
    }

    let valid = bcrypt.compareSync(password, user.password);

    if(!valid) {
        res.status(403).json({
            detail: "Invalid username and/or password",
            status:403
        });
        return;
    }

    // All is well, create JWT
    let data = {
        user_id: user.id,
        name: user.name,
        username: user.username
    };

    let token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({jwt: token});
});

module.exports = router;