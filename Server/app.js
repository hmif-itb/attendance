require('dotenv').config();

const express = require('express');
const { check, validationResult } = require('express-validator/check');

const events = require('./datastore/events');

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to HMIFTECH attendance system');
});

app.get('/events',(req,res)=>{
    events.list().then((events) => {
        res.json(events);
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            'detail':err,
            'status':500
        });
    });

    /*db.collection(dbPath.events).get().then((snapshot)=>{
        let items = snapshot.docs.map(item => {
            return {'id':item.id, ...item.data()};
        });
        res.json(items);
    }).catch(err => {
        res.status(500).json({
            'detail':err,
            'status':500
        });
    });*/
});

app.get('/events/:id',(req,res)=>{
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
            'detail':err,
            'status':500
        });
    });

    /*db.collection(dbPath.events).doc(req.params.id).get().then((snapshot)=>{
        if(!snapshot.exists){
            res.status(404).json({
                'detail':'ID not found',
                'status':404
            });
        }else{
            res.json(snapshot.data());
        }
    }).catch(err => {
        res.status(500).json({
            'detail':err,
            'status':500
        });
    });*/
});

app.post('/events',[
        /*check('name')
        .trim()
        .escape()
        .isAlphanumeric()
        .exists()*/
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
                res.json({id: id});
            }).catch((err)=>{
                console.log(err);
                res.status(500).json({
                    'detail':err,
                    'status':500
                });
            });

            /*db.collection(dbPath.events).add({
                name: req.body.name,
                logo: req.body.logo
            }).then((ref)=>{
                console.log('yay');
                res.location('/events/'+ref.id).sendStatus(200);
            }).catch((err)=>{
                res.status(500).json({
                    'detail':err,
                    'status':500
                });
            })*/
        }
});

/*app.post('/events',[
        check('name')
        .trim()
        .escape()
        .isAlphanumeric()
        .exists(),
        check('logo')
        .trim()
        .isURL()
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
            db.collection(dbPath.events).add({
                name: req.body.name,
                logo: req.body.logo
            }).then((ref)=>{
                res.location('/events/'+ref.id).sendStatus(200);
            }).catch((err)=>{
                res.status(500).json({
                    'detail':err,
                    'status':500
                });
            })
            
        }
});*/

app.listen(port, () => {
    console.log(`Server started on ${port}!`);
});