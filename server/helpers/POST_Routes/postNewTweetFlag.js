const postNewTweetFlag = (req, res, knex) => {

  const postNewFlag = trx => knex('pg_tweets')
    .transacting(trx)
    .where('id', req.params.tweet_id)
    .increment('flag_count', 1);

  const updateTimeStamp = trx => knex('pg_tweets')
    .transacting(trx)
    .where('id', req.params.tweet_id)
    .update({ updated_at: knex.fn.now() });

  knex.transaction(trx => {
    Promise.all([
      postNewFlag(trx),
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
    console.error('Error inside postNewTweetFlag.js: ', err);
    res.send(false);
  });

};

module.exports = postNewTweetFlag;
