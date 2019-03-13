/**
 * Student data route
 */

let express = require('express');
let router = express.Router();
const mhs = require('../datastore/mhs');
const { check, validationResult } = require('express-validator/check');

/**
 * Get student data by NIM
 */
router.get('/get/:nim', function(req, res) {
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
});

/**
 * Add student data
 */
router.post('/add',[
    check('name')
        .trim()
        .escape()
        .exists(),
    check('nim')
        .trim()
        .escape()
        .isAlphanumeric()
        .exists()
],(req,res)=>{
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        let field = new Set();

        errors.array().forEach((item)=>{
            field.add(item.param);
        });

        res.status(400).json({
            'detail':'Invalid value for '+[...field].join(', '),
            'status':400
        });
    } else {
        mhs.add(req.body.nim, req.body.name).then((id) => {
            if(id)
                res.json({id: id});
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
router.post('/update/:id',[
    check('name')
        .trim()
        .escape()
        .exists(),
    check('nim')
        .trim()
        .escape()
        .isAlphanumeric()
        .exists()
],(req,res)=>{
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        let field = new Set();

        errors.array().forEach((item)=>{
            field.add(item.param);
        });

        res.status(400).json({
            'detail':'Invalid value for '+[...field].join(', '),
            'status':400
        });
    } else {
        mhs.update(req.params.id, req.body.nim, req.body.name).then((ret) => {
            if(ret)
                res.json({success: true});
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
router.post('/delete/:id', (req,res)=>{
    let errors = validationResult(req);

    mhs.delete(req.params.id).then((ret) => {
        res.json({success: true});
    }).catch((err)=>{
        console.log(err);
        res.status(500).json({
            'detail':err,
            'status':500
        });
    });
});

module.exports = router;