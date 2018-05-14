const app = require('express')();
const bodyParser = require('body-parser');

// Set environment variables (.env)
require('dotenv').config();

// PORT number
const PORT = process.env.HTTP_PORT || 5000;

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use /contact API route
app.use('/contact', require('./routes/contact'));

// Server listening
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));

// Export for testing
module.exports = app;