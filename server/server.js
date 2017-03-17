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
  consumer_key:         'yvETWoGKF4OWU393atHUQr93G',
  consumer_secret:      'sIN3vqs4P8a1BYALf0X1YTsjBW35WifTEaKEZpp5h0v89NrSy0',
  access_token:         '842612753965576193-Z0hLLTeFwVMasygoHdZUSKktC9jLZlY',
  access_token_secret:  'te9dez3fR9QpcxFYmXoXg4uvK0WUDslAMfN06jCkkpven',
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
const postNewTweetLike = require('./helpers/POST_Routes/postNewTweetLike.js');


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


// ***************************************************
// ROUTES - UPDATE
// ***************************************************



// ***************************************************
// ROUTES - DELETE
// ***************************************************
