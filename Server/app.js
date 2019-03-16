require('dotenv').config();
const express = require('express');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Headers");
    res.header("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS, PUT");
    next();
});

app.use('/students', require('./auth'), require('./routes/students'));
app.use('/events', require('./auth'), require('./routes/events'));
app.use('/users', require('./auth'), require('./routes/users'));
app.use('/auth', require('./routes/auth'));

app.get('/', (req, res) => {
    res.send('Welcome to HMIFTECH attendance system');
});

app.listen(port, () => {
    console.log(`Server started on ${port}!`);
});