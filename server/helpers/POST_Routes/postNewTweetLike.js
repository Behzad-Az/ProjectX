const postNewTweetLike = (req, res, knex) => {
  const postNewLike = () => knex('tweets')
    .where('id', req.params.tweet_id)
    .increment('like_count', 1);

  postNewLike()
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside postNewTweetLike.js: ', err);
    res.send(false);
  });

};

module.exports = postNewTweetLike;
