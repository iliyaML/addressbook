const express = require('express');
const bodyParser = require('body-parser');

require('dotenv').config();

// Initialize app
const app = express();

// PORT number
const PORT = process.env.PORT || 5000;

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use /contact API route
app.use('/contact', require('./routes/contact'));

// Server listening
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));

// Export for testing
module.exports = app;