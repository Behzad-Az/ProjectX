'use strict';

// ***************************************************
// DEPENDENCIES
// ***************************************************
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./db/knexfile.js').development;
const knex = require('knex')(connection);
const twt = require('twit');
const twit = new twt({
  consumer_key:         'ipjomvGgE12ytDz1PabO9rjy6',
  consumer_secret:      'IGWhVU267tpAOtThg2SIrNwAvm0RY4qvW4BrNwD8nDEdlDNK4P',
  access_token:         '810197460144586752-CtpXr9XwWrx7EiDobSRMziZufA4OFWq',
  access_token_secret:  '9RH6rMVNpNrjJCax3xMK1XAjFkSrjKi9irVsOwmsoEplg',
  timeout_ms:           60*1000  // optional HTTP request timeout to apply to all requests.
});

// ***************************************************
// MIDDLEWARE
// ***************************************************
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// ***************************************************
// PORT
// ***************************************************
const PORT = process.env.PORT || 19001;
const server = app.listen(PORT, '127.0.0.1', 'localhost', () => console.log(`Listening on ${ PORT }`));

// ***************************************************
// HELPERS
// ***************************************************
const getTweets = require('./helpers/GET_Routes/getTweets.js');
const postNewTweet = require('./helpers/POST_Routes/postNewTweet.js');


// ***************************************************
// ROUTES - GET
// ***************************************************
app.get('/api/home', (req, res) => {
  getTweets(req, res, knex);
});


// ***************************************************
// ROUTES - POST
// ***************************************************
app.post('/api/tweets', (req, res) => {
  postNewTweet(req, res, knex, twit);
});


// ***************************************************
// ROUTES - UPDATE
// ***************************************************



// ***************************************************
// ROUTES - DELETE
// ***************************************************
