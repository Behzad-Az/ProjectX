const getTweets = (req, res, knex) => {

  const filterTweets = () => knex.raw(
    "select extract('epoch' FROM now()::timestamp - created_at) / 3600 AS hours_ago, id, poster_name, company, location, content, like_count FROM pg_tweets where deleted_at is null order by created_at DESC NULLS LAST;")

  filterTweets()
  .then(tweets => res.send({ tweets: tweets.rows }))
  .catch(err => {
    console.error('Error inside getTweets.js: ', err);
    res.send(false);
  });

};

module.exports = getTweets;
