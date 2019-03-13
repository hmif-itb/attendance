/**
 * Events route
 */

let express = require('express');
let router = express.Router();
const events = require('../datastore/events');
const attendances = require('../datastore/attendances');
const utils = require('../utils');
const { check, validationResult } = require('express-validator/check');

const idCheck = check('id').trim().escape().matches(/^[a-zA-Z0-9]{20}$/).exists();
const nameCheck = check('name').trim().escape().matches(/^[a-zA-Z0-9 ]{5,}$/).exists();

/**
 * List all events
 */
router.get('/',(req,res)=>{
    events.list().then((events) => {
        res.json(events);
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            'detail':err,
            'status':500
        });
    });
});

/**
 * Get specific event by ID
 */
router.get('/:id',[
    idCheck
],(req,res)=>{
    let errors = validationResult(req);

    if(!errors.isEmpty()){
        res.status(400).json({
            'detail':utils.paramErrorMessage(errors),
            'status':400
        });
    }else{
        events.get(req.params.id).then((event) => {
            if(event == null) {
                res.status(404).json({
                    'detail':'ID not found',
                    'status':404
                });
            } else {
                res.json(event);
            }
        }).catch(err => {
            res.status(500).json({
                'detail':err.details,
                'status':500
            });
        });
    }
});

/**
 * Edit an event
 */
router.put('/:id',[
    nameCheck,
    idCheck
],(req,res)=>{
    let errors = validationResult(req);

    if(!errors.isEmpty()){
        res.status(400).json({
            'detail':utils.paramErrorMessage(errors),
            'status':400
        });
    }else{
        events.edit(req.params.id, req.body.name).then((result)=>{
            res.sendStatus(200);
        }).catch((err)=>{
            console.log(err);
            if(err.code==5){
                res.status(404).json({
                    'detail':'ID not found',
                    'status': 404
                });
            }else{
                res.status(500).json({
                    'detail':err.details,
                    'status':500
                });
            }
        });
    }
});

/**
 * Create an event
 */
router.post('/',[
    nameCheck
],(req,res)=>{
    var errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({
            'detail':utils.paramErrorMessage(errors),
            'status':400
        });
    } else {
        events.add(req.body.name).then((id) => {
            // res.location('/events/'+ref.id).sendStatus(200);
            res.json({id: id});
        }).catch((err)=>{
            console.log(err);
            res.status(500).json({
                'detail':err.details,
                'status':500
            });
        });
    }
});

/**
 * Delete an event
 */
router.delete('/:id',[
    idCheck
],(req,res)=>{
    let errors = validationResult(req);

    if(!errors.isEmpty()){
        res.status(400).json({
            'detail':utils.paramErrorMessage(errors),
            'status':400
        });
    }else{
        events.delete(req.params.id).then((result)=>{
            res.sendStatus(200);
        }).catch((err)=>{
            res.status(500).json({
                'detail':err.details,
                'status':500
            });
        });
    }
});

/**
 * Get attendance list
 */
router.get('/:id/attendances',[
    idCheck
],(req,res)=>{
    let errors = validationResult(req);

    if(!errors.isEmpty()){
        res.status(400).json({
            'detail':utils.paramErrorMessage(errors),
            'status':400
        });
    }else{
        attendances.listByEvent(req.params.id).then((events) => {
            res.json(events);
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
 * Attend an event
 */
router.post('/:id/attend',[
    check('nim')
        .trim()
        .escape()
        .isNumeric()
        .exists()
],(req,res)=>{
    let errors = validationResult(req);

    if(!errors.isEmpty()){
        res.status(400).json({
            'detail':utils.paramErrorMessage(errors),
            'status':400
        });
    }else{
        attendances.add(req.params.id,req.body.nim).then(()=>{
            res.sendStatus(200);
        }).catch((err)=>{
            console.log(err);
            res.status(500).json({
                'detail':err.details,
                'status':500
            });
        });
    }
})


module.exports = router;