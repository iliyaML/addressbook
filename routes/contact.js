const express = require('express');
const elasticsearch = require('elasticsearch');
const url = require('url');
const router = express.Router();
const validateBodyInput = require('../validation/validateBodyInput');

// Intialize index and type names
const indexName = 'contact';
const typeName = 'document';

// Initialize ES client
// Establish client
const client = new elasticsearch.Client({
    host: process.env.ES_HOST
});

// Check to see if index exists
// If it does, delete index and create new index
// And initialize some dummy values
client.indices.exists({
    index: indexName
})
    .then(exists => {
        if (exists) {
            return client.indices.delete({
                index: indexName
            });
        }
    })
    .then(() => {
        return client.indices.create({
            index: indexName
        });
    })
    .then(() => {
        return client.indices.putMapping({
            index: indexName,
            type: typeName,
            body: {
                properties: {
                    fullname: { type: 'text' },
                    email: { type: 'text' },
                    phone: { type: 'long' },
                    address: { type: 'text' }
                }
            }
        });
    })
    .then(() => {
        const promises = [
            {
                name: 'Michael',
                fullname: 'Michael Jordan',
                email: 'michael@gmail.com',
                phone: 6156002946,
                address: 'Nashville, TN'
            },
            {
                name: 'David',
                fullname: 'David Johnson',
                email: 'david@gmail.com',
                phone: 9984876300,
                address: 'Nashville, TN'
            },
            {
                name: 'Chris',
                fullname: 'Chris Pratt',
                email: 'chris@gmail.com',
                phone: 1234343091,
                address: 'Nashville, TN'
            }
        ].map(user => {
            return client.index({
                index: indexName,
                type: typeName,
                id: user.name,
                body: {
                    fullname: user.fullname,
                    email: user.email,
                    phone: user.phone,
                    address: user.address
                }
            });
        });
        return Promise.all(promises);
    });

// @route   GET /contact
// @desc    Get contact information
// @access  Public
router.get('/', (req, res) => {
    const { page, pageSize, query } = url.parse(req.url, true).query;

    client.search({
        index: indexName,
        type: typeName,
        from: page,
        size: pageSize,
        q: query
    }, (err, resp) => {
        if (err) {
            res.status(400).json({
                status: 400,
                response: err.message,
                success: false
            });
        } else {
            res.status(200).json({
                status: 200,
                response: resp.hits.hits,
                success: true
            });
        }
    });
});

// @route   POST /contact
// @desc    Post contact
// @access  Public
router.post('/', (req, res) => {
    const { errors, isValid } = validateBodyInput(req.body);

    // Verify inputs
    if (!isValid) {
        return res.status(400).json({
            errors
        });
    }

    const { name, fullname, email, phone, address } = req.body;

    // Search for the user by id/name
    client.get({
        index: indexName,
        type: typeName,
        id: name
    }, (err, resp) => {
        if (err) {
            // If the name does not exist
            // Create the user
            client.index({
                index: indexName,
                type: typeName,
                id: name,
                body: {
                    fullname,
                    email,
                    phone,
                    address
                }
            }, (err, resp, status) => {
                if (err) {
                    res.status(400).json({
                        status: 400,
                        response: `The following error occured: ${err}`,
                        success: false
                    });
                } else {
                    // Create user if no error
                    res.status(200).json({
                        status: 200,
                        response: 'User successfully created!',
                        success: true,
                        result: resp.result
                    });
                }
            });
        } else {
            // If name is already taken
            res.status(200).json({
                status: 200,
                response: 'Username is already taken',
                success: false
            });
        }
    });
});

// @route   GET /contact/:name
// @desc    Get contact information for a specific user
// @access  Public
router.get('/:name', (req, res) => {
    const { name } = req.params;

    client.get({
        index: indexName,
        type: typeName,
        id: name
    }, (err, resp) => {
        if (err) {
            res.status(err.statusCode).json({
                status: err.statusCode, // 404
                response: 'User does not exist',
                success: false
            });
        } else {
            res.status(200).json({
                status: 200,
                response: resp._source,
                success: true
            });
        }
    });
});

// @route   PUT /contact/:name
// @desc    Update contact information for a specific user
// @access  Public
router.put('/:name', (req, res) => {
    const { errors, isValid } = validateBodyInput(req.body);

    // Verify inputs
    if (!isValid) {
        return res.status(400).json({
            errors
        });
    }

    const { name } = req.params;
    const { fullname, email, phone, address } = req.body;

    client.update({
        index: indexName,
        type: typeName,
        id: name,
        body: {
            doc: {
                fullname,
                email,
                phone,
                address
            }
        }
    }, (err, resp) => {
        if (err) {
            res.status(err.statusCode).json({
                status: err.statusCode, // 404
                response: 'User does not exist',
                success: false
            });
        } else {
            res.status(200).json({
                status: 200,
                response: 'User successfully updated!',
                success: true,
                result: resp.result
            });
        }
    });
});


// @route   DELETE /contact/:name
// @desc    Delete contact name and all associated information
// @access  Public
router.delete('/:name', (req, res) => {
    const { name } = req.params;

    client.delete({
        index: indexName,
        type: typeName,
        id: name
    }, (err, resp) => {
        if (err) {
            res.status(err.statusCode).json({
                status: err.statusCode, // 404
                response: 'User does not exist',
                success: false
            });
        } else {
            res.status(200).json({
                status: 200,
                response: 'User successfully deleted!',
                success: true
            });
        }
    });
});

module.exports = router;