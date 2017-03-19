const postNewTweet = (req, res, knex, twit) => {
  const MAX_CHAR_COUNT = 140;
  const profanityPhrases = ['fuck', 'dick', 'asshole', 'bitch', 'motherfucker'];

  const poster_name = req.body.posterName.trim() || 'Anonymous';
  const company = req.body.company.trim();
  const location = req.body.location.trim();
  const country = req.body.country.trim();
  const title = req.body.title.trim();
  const content = req.body.content.trim();
  const tweetEnd = `@${company} #${company}` + (location ? ` #${location}` : '') + (country ? ` #${country}` : '') + '\n';

  let newTweetObj = {
    poster_name,
    company,
    location,
    country,
    title,
    content
  };

  const determineTwtArr = () => {
    let contentLength = content.length;
    let tweetEndLength = tweetEnd.length;
    let availableLength = MAX_CHAR_COUNT - title.length - tweetEndLength -  8;
    let numberOfTweets = Math.ceil(contentLength / availableLength);
    let tweetArr = [];
    for (let i = 1; i <= numberOfTweets; i++) {
      let tweet = `${title}(${i}/${numberOfTweets})\n` + tweetEnd + content.slice((i - 1) * availableLength, i * availableLength) + `${i === numberOfTweets ? '' : '-'}`;
      tweetArr.push(tweet);
    }
    return tweetArr;
  };

  const profanityFilter = () => new Promise((resolve, reject) => {
    let error = false;
    profanityPhrases.forEach(phrase => {
      if (content.includes(phrase)) { error = true; }
    });
    error ? reject('profanity detected') : resolve();
  });


  const postToPg = () => knex('pg_tweets')
    .insert(newTweetObj)
    .returning('id');

  const postToTwitter = (pg_tweet_id, status) => twit.post('statuses/update', { status }, (err, response) => {
    if (err) { console.log('Error while posting to Twitter: ', err); }
    else { postTwitterId(pg_tweet_id, response.id).then(() => {}); }
  });

  const postTwitterId = (pg_tweet_id, twitter_id) => knex('twitter_ids').insert({ pg_tweet_id, twitter_id });

  profanityFilter()
  .then(() => postToPg())
  .then(id => {
    res.send(true);
    determineTwtArr().forEach(status => postToTwitter(id[0], status));
  })
  .catch(err => {
    console.error('Error inside postNewTweet.js', err);
    res.send(false);
  });

};

module.exports = postNewTweet;
