const getTweetPageData = (req, res, knex) => {

  const getTweets = () => knex('pg_tweets')
    .select('id', 'poster_name', 'company_hashtag', 'work_location_hashtag', 'content', 'like_count', 'created_at')
    .whereNull('deleted_at')
    .orderBy('created_at', 'desc')
    .limit(10)
    .offset(req.query.tweetsoffset);

  getTweets()
  .then(tweets => res.send({ tweets }))
  .catch(err => {
    console.error('Error inside getTweetPageData.js: ', err);
    res.send(false);
  });

};

module.exports = getTweetPageData;
