'use strict';

// ***************************************************
// DEPENDENCIES
// ***************************************************
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./db/knexfile.js').development;
const knex = require('knex')(connection);
// const twt = require('twit');
const twt = require('twit');
const twit = new twt({
  consumer_key:         'Hk0pkpzCIltV00R5H8fZlUNRD',
  consumer_secret:      'zVhvJyWko8OwHrAU21H0eNwvQhkhc0R5ucnZD4AZsa1CHViL2U',
  access_token:         '842612753965576193-CO3sHGdi4XweqJCiSCQPfGsfj4LT9z5',
  access_token_secret:  'Cb0t672WuxmfrBQKU4weee2dttCpTWINPeZIqJFqOx8xp',
  // timeout_ms:           60*1000  // optional HTTP request timeout to apply to all requests.
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
const postNewTweetLike = require('./helpers/POST_Routes/postNewTweetLike.js');
const postNewTweetFlag = require('./helpers/POST_Routes/postNewTweetFlag.js');


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

app.post('/api/tweets/:tweet_id/likes', (req, res) => {
  postNewTweetLike(req, res, knex);
});

app.post('/api/tweets/:tweet_id/flags', (req, res) => {
  postNewTweetFlag(req, res, knex);
});


// ***************************************************
// ROUTES - UPDATE
// ***************************************************



// ***************************************************
// ROUTES - DELETE
// ***************************************************
