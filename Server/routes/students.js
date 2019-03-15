/**
 * Student data route
 */

let express = require('express');
let router = express.Router();
const mhs = require('../datastore/students');
const utils = require('../utils');
const attendances = require('../datastore/attendances');
const { check, validationResult } = require('express-validator/check');

const idCheck = check('id').trim().escape().matches(/^[a-zA-Z0-9]{20}$/).exists();
const nimCheck = check('nim').trim().escape().isAlphanumeric().exists();
const nameCheck = check('name').trim().escape().exists();

/**
 * Get student data by NIM
 */
router.get('/:nim', [
    nimCheck
],function(req, res) {
    let errors = validationResult(req);

    if(!errors.isEmpty()){
        res.status(400).json({
            'detail':utils.paramErrorMessage(errors),
            'status':400
        });
    }else{
        mhs.get(req.params.nim).then((student) => {
            if(student == null) {
                res.status(404).json({
                    'detail':'Student not found',
                    'status':404
                });
            } else {
                res.json(student);
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                'detail':err,
                'status':500
            });
        });
    }
});

/**
 * Add student data
 */
router.post('/',[
    nameCheck,
    nimCheck
],(req,res)=>{
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({
            'detail':utils.paramErrorMessage(errors),
            'status':400
        });
    } else {
        mhs.add(req.body.nim, req.body.name).then((id) => {
            if(id)
                res.json({id: id});
                // res.location('/students/'+req.body.nim).sendStatus(200);
            else
                res.status(400).json({
                    'detail': "Student with the same NIM already exists",
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
 * Update student data
 */
router.put('/:id',[
    nameCheck,
    idCheck,
    nimCheck
],(req,res)=>{
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({
            'detail':utils.paramErrorMessage(errors),
            'status':400
        });
    } else {
        mhs.update(req.params.id, req.body.nim, req.body.name).then((ret) => {
            if(ret)
                // res.json({success: true});
                res.sendStatus(200);
            else
                res.status(400).json({
                    'detail': "Student with the same NIM already exists",
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
 * Delete student data
 */
router.delete('/:id', [
    idCheck
],(req,res)=>{
    let errors = validationResult(req);
    
    if(!errors.isEmpty()){
        res.status(400).json({
            'detail':utils.paramErrorMessage(errors),
            'status':400
        });
    }else{
        mhs.delete(req.params.id).then((ret) => {
            res.sendStatus(200);
            // res.json({success: true});
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
 * Get all event attended by a student
 */
router.get('/:nim/attendances',[
    nimCheck
],(req,res)=>{
    let errors = validationResult(req);

    if(!errors.isEmpty()){
        res.status(400).json({
            'detail':utils.paramErrorMessage(errors),
            'status':400
        });
    }else{
        attendances.listByNIM(req.params.nim).then((events)=>{
            res.json(events);
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