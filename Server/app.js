require('dotenv').config();
const express = require('express');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use('/students', require('./routes/students'));
app.use('/events', require('./routes/events'));

app.get('/', (req, res) => {
    res.send('Welcome to HMIFTECH attendance system');
});

app.listen(port, () => {
    console.log(`Server started on ${port}!`);
});