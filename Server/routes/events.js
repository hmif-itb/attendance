/**
 * Events route
 */

let express = require('express');
let router = express.Router();
const events = require('../datastore/events');
const { check, validationResult } = require('express-validator/check');

/**
 * List all events
 */
router.get('/events',(req,res)=>{
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
router.get('/events/:id',(req,res)=>{
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
});

/**
 * Edit an event
 */
router.put('/events/:id',[
    check('name')
        .trim()
        .escape()
        .matches(/^[a-zA-Z0-9 ]{5,}$/)
        .exists()
],(req,res)=>{
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
});

/**
 * Create an event
 */
router.post('/events',[
    check('name')
        .trim()
        .escape()
        .matches(/^[a-zA-Z0-9 ]{5,}$/)
        .exists()
],(req,res)=>{
    var errors = validationResult(req);

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
router.delete('/events/:id',(req,res)=>{
    events.delete(req.params.id).then((result)=>{
        res.sendStatus(200);
    }).catch((err)=>{
        res.status(500).json({
            'detail':err.details,
            'status':500
        });
    });
});

module.exports = router;