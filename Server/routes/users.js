/**
 * Student data route
 */

let express = require('express');
let router = express.Router();
const users = require('../datastore/users');
const utils = require('../utils');
const { check, validationResult } = require('express-validator/check');

const idCheck = check('id').trim().escape().matches(/^[a-zA-Z0-9]{20}$/).exists();
const usernameCheck = check('username').trim().escape().isAlphanumeric().exists();
const nameCheck = check('name').trim().escape().exists();
const passwordCheck = check('password').trim().escape().exists();

/**
 * Add user
 */
router.post('/',[
    usernameCheck,
    nameCheck,
    passwordCheck
],(req,res)=>{
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({
            'detail':utils.paramErrorMessage(errors),
            'status':400
        });
    } else {
        users.add(req.body.name, req.body.username, req.body.password).then((id) => {
            if (id)
                res.json({id: id});
            else
                res.status(400).json({
                    'detail': "User with the same username already exists",
                    'status': 400
                })
        }).catch((err) => {
            console.log(err);
            res.status(500).json({
                'detail': err,
                'status': 500
            });
        });;
    }
});

/**
 * Update user data
 */
router.put('/:id',[
    check('username').trim().escape().isAlphanumeric(),
    check('name').trim().escape(),
    check('password').trim().escape()
],(req,res)=>{
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({
            'detail':utils.paramErrorMessage(errors),
            'status':400
        });
    } else {
        users.update(req.params.id, req.body.name, req.body.username, req.body.password).then((ret) => {
            if(ret)
                res.sendStatus(200);
            else
                res.status(400).json({
                    'detail': "User with the same username already exists",
                    'status':400
                });
        }).catch((err)=>{
            console.log(err);
            res.status(500).json({
                'detail':err,
                'status':500
            });
        });
    }
});

/**
 * Delete user
 */
router.delete('/:id', [idCheck], (req,res)=>{
    let errors = validationResult(req);
    
    if(!errors.isEmpty()){
        res.status(400).json({
            'detail':utils.paramErrorMessage(errors),
            'status':400
        });
    } else {
        // Make sure the deleted user is NOT the logged in user
        if(req.user.user_id === req.params.id) {
            res.status(400).json({
                'detail': "Cannot delete currently logged in user",
                'status':400
            });
            return;
        }

        users.delete(req.params.id).then((ret) => {
            res.sendStatus(200);
        }).catch((err)=>{
            console.log(err);
            res.status(500).json({
                'detail':err,
                'status':500
            });
        });
    }

});

module.exports = router;