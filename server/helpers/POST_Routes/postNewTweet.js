const postNewTweet = (req, res, knex, twit) => {
  const MAX_CHAR_COUNT = 140;
  const profanityPhrases = ['fuck', 'dick', 'asshole', 'bitch', 'motherfucker'];

  const conditionTitle = title => {
    switch(title.trim().toLowerCase()) {
      case 'awesome':
        return ' #awesome';
      case 'alright':
        return ' #cool';
      case 'funny':
        return ' #funny';
      case 'sucks':
        return ' #sucks';
      default:
        return '';
    }
  };

  const company = req.body.company.trim();
  const location = req.body.location.trim();
  const title = conditionTitle(req.body.title);
  const content = req.body.content.trim();

  let newTweetObj = {
    poster_name: req.body.posterName.trim() || 'Anonymous',
    company: company || null,
    location,
    title,
    content: content || null
  };

  const determineTwtArr = () => {
    const companyIdentifier = `#${company}` + (location ? ` #${location}` : '');
    const tweetEnd = '#WorkerVent';
    const availableLength = MAX_CHAR_COUNT - title.length - tweetEnd.length -  23;
    const numberOfTweets = Math.ceil(content.length / availableLength);
    let tweetArr = [];
    for (let i = 1; i <= numberOfTweets; i++) {

      let tweet = companyIdentifier +
                  title +
                  (numberOfTweets > 1 ? ` (${i}/${numberOfTweets})\n` : '\n') +
                  content.slice((i - 1) * availableLength, i * availableLength) +
                  `${i === numberOfTweets ? '\n' : '-\n'}` +
                  tweetEnd;
      console.log(tweet, `\n ${tweet.length}`);
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

  determineTwtArr();

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
