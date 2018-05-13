const chai = require('chai');
const chaiHttp = require('chai-http');
const elasticsearch = require('elasticsearch');
const server = require('../server');
const should = chai.should();

// Establish client
const client = new elasticsearch.Client({
    host: 'localhost:9200'
});

// chai-http Middleware
chai.use(chaiHttp);

// Initialize the index and type names
const indexName = 'testcontact';
const typeName = 'document';

// Profile for dummy
const newUser = {
    name: 'Iliya',
    email: 'iliyamlokman@gmail.com',
    phone: '999',
    address: 'Nashville, TN'
};

describe('Address Book', () => {
    before(done => {
        // Before any test is executed
        // Create a fresh and clean index
        client.indices.exists({
            index: indexName
        })
            .then((exists) => {
                if (exists) {
                    return client.indices.delete({
                        index: indexName
                    });
                }
            })
            .then(() => {
                return client.indices.create({
                    index: indexName
                }, done);
            });
    });

    describe('GET /contact', () => {
        it('it should get an empty contact list', done => {
            chai.request(server)
                .get('/contact')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.response.should.be.a('array');
                    res.body.response.length.should.be.eql(0);
                    res.body.should.have.property('success');
                    res.body.should.have.property('success').eql(true);
                    done();
                });
        });
    });

    describe('POST /contact', () => {
        it('it should add a user with name', done => {
            chai.request(server)
                .post('/contact')
                .send(newUser)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('result');

                    chai.request(server)
                        .get('/contact/Iliya')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.response.should.be.a('object');
                            res.body.response.should.have.property('phone').eql(newUser.phone);
                            res.body.response.should.have.property('email').eql(newUser.email);
                            res.body.response.should.have.property('address').eql(newUser.address);
                            res.body.should.have.property('success').eql(true);
                            done();
                        });
                });
        });

        it('it should not add a user if the name is already taken', done => {
            chai.request(server)
                .post('/contact')
                .send(newUser)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('response').eql('Username is already taken');
                    res.body.should.have.property('success').eql(false);
                    done();
                });
        });
    });

    describe('GET /contact/:name', () => {
        it('it should get a user given the name', done => {
            chai.request(server)
                .get('/contact/Iliya')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.response.should.be.a('object');
                    res.body.response.should.have.property('phone').eql(newUser.phone);
                    res.body.response.should.have.property('email').eql(newUser.email);
                    res.body.response.should.have.property('address').eql(newUser.address);
                    res.body.should.have.property('success').eql(true);
                    done();
                });
        });

        it('it should give an error if the user does not exist', done => {
            chai.request(server)
                .get('/contact/Jonathan')
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('response').eql('User does not exist');
                    res.body.should.have.property('success').eql(false);
                    done();
                });
        });
    });

    describe('PUT /contact/:name', () => {
        const newProperties = {
            phone: '889',
            address: 'Washington DC, VA'
        };

        it('it should update a user given the name', done => {
            chai.request(server)
                .put('/contact/Iliya')
                .send(newProperties)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('response').eql('User successfully updated!');
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('result')

                    // Follow up request
                    // Using GET to check if the fields were updated
                    chai.request(server)
                        .get('/contact/Iliya')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.response.should.be.a('object');
                            res.body.response.should.have.property('phone').eql(newProperties.phone);
                            res.body.response.should.have.property('address').eql(newProperties.address);
                            res.body.should.have.property('success').eql(true);
                            done();
                        });
                });
        });

        it('it should give an error if the user does not exist', done => {
            chai.request(server)
                .put('/contact/Jonathan')
                .send(newProperties)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('response').eql('User does not exist');
                    res.body.should.have.property('success').eql(false);
                    done();
                });
        });
    });

    describe('DELETE /contact/:name', () => {
        it('it should delete a user given the name', done => {
            chai.request(server)
                .delete('/contact/Iliya')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('response').eql('User successfully deleted!');
                    res.body.should.have.property('success').eql(true);

                    // Follow up request
                    // Using GET to check if user Iliya still exists
                    chai.request(server)
                        .get('/contact/Iliya')
                        .end((err, res) => {
                            res.should.have.status(404);
                            res.body.should.have.property('response').eql('User does not exist');
                            res.body.should.have.property('success').eql(false);
                            done();
                        });
                });
        });

        it('it should give an error as the user no longer exists', done => {
            chai.request(server)
                .delete('/contact/Iliya')
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('response').eql('There is no user with the name Iliya');
                    res.body.should.have.property('success').eql(false);
                    done();
                });
        });
    });
});