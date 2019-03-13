require('dotenv').config();

const express = require('express');
const { check, validationResult } = require('express-validator/check');

const events = require('./datastore/events');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use('/mhs', require('./routes/mhs'));
app.use('/', require('./routes/events'));

app.get('/', (req, res) => {
    res.send('Welcome to HMIFTECH attendance system');
});

app.listen(port, () => {
    console.log(`Server started on ${port}!`);
});