require('dotenv').config();

const api = require('./app');

api.listen(process.env.PORT, () => {
    console.log(`API listening on port ${process.env.PORT}...`);
})