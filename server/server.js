'use strict';

// ***************************************************
// DEPENDENCIES
// ***************************************************
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./db/knexfile.js').development;
const knex = require('knex')(connection);
const elasticsearch = require('elasticsearch');
const esClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
});
const twt = require('twit');
const twit = new twt({
  consumer_key:         'rb5lc91Bcexs9v2iXgUJyPNdB',
  consumer_secret:      'NuZVR0kvze6UPUxeSSFYLIlxAZp8BxvDksmdVxQH51pjgcrhvd',
  access_token:         '842612753965576193-nBV9xsXIAgHNRoU5dpNhVBrfnHWRgYO',
  access_token_secret:  'WhyuSjeNZdIRZcLY60tApenkbz8ICMtotiBKBHyTgkMIl',
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
const postNewTweetFlag = require('./helpers/POST_Routes/postNewTweetFlag.js');
const postSearchBarResults = require('./helpers/POST_Routes/postSearchBarResults.js');


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

app.post('/api/searchbar', (req, res) => {
  postSearchBarResults(req, res, esClient);
});


// ***************************************************
// ROUTES - UPDATE
// ***************************************************



// ***************************************************
// ROUTES - DELETE
// ***************************************************
