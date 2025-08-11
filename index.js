const express = require('express');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Conectar a MongoDB
connectDB();

app.use('/alexa', require('./routes/alexaRoute'));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});