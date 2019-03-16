require('dotenv').config();
const express = require('express');
const cors = require('cors')

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

app.options('*', cors());
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