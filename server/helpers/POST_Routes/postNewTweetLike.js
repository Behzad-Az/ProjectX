const postNewTweetLike = (req, res, knex) => {

  const postNewLike = trx => knex('pg_tweets')
    .transacting(trx)
    .where('id', req.params.tweet_id)
    .increment('like_count', 1);

  const updateTimeStamp = trx => knex('pg_tweets')
    .transacting(trx)
    .where('id', req.params.tweet_id)
    .update({ updated_at: knex.fn.now() });

  knex.transaction(trx => {
    Promise.all([
      postNewLike(trx),
      updateTimeStamp(trx)
    ])
    .then(() => trx.commit())
    .catch(err => {
      trx.rollback();
      throw err;
    });
  })
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside postNewTweetLike.js: ', err);
    res.send(false);
  });

};

module.exports = postNewTweetLike;
