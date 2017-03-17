const getTweets = (req, res, knex) => {

  // const filterTweets = () => knex('tweets')
  //   .select('id', 'poster_name', 'plant_name', 'country', 'content', 'like_count', 'tweet_created_at')
  //   .whereNull('tweet_deleted_at')
  //   .orderBy('tweet_created_at', 'desc');

  const filterTweets = () => knex.raw(
    "select extract('epoch' FROM now()::timestamp - tweet_created_at) / 3600 AS hours_ago, id, poster_name, plant_name, country, content, like_count FROM tweets where tweet_deleted_at is null order by tweet_created_at DESC NULLS LAST;")

  filterTweets()
  .then(tweets => res.send({ tweets: tweets.rows }))
  .catch(err => {
    console.error('Error inside getTweets.js: ', err);
    res.send(false);
  });

};

module.exports = getTweets;
