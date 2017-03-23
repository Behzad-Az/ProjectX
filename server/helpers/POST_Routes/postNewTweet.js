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

  const company = req.body.company.trim().replace(/ /g, '_');
  const location = req.body.location.trim().replace(/ /g, '_');
  const title = conditionTitle(req.body.title);
  const content = req.body.content.trim();

  let newTweetObj = {
    poster_name: req.body.posterName.trim() || 'Anonymous',
    company: company || null,
    location,
    title,
    content: content || null
  };

  const divideTweet = (content, maxLength, tweetBodyArr = []) => {
    let tweetBody = content.slice(0, maxLength);
    if (content.length < maxLength) {
      tweetBodyArr.push(tweetBody);
      return tweetBodyArr;
    } else {
      let lastSpaceIndex = tweetBody.lastIndexOf(' ');
      tweetBody = tweetBody.slice(0, lastSpaceIndex);
      tweetBodyArr.push(tweetBody + '_');
      return divideTweet(content.replace(tweetBody + ' ', ''), maxLength, tweetBodyArr);
    }
  };

  const determineTwtArr = () => {
    const companyIdentifier = `#${company}` + (location ? ` #${location}` : '');
    const tweetEnd = '\n#WorkerVent';
    const maxLength = MAX_CHAR_COUNT - companyIdentifier.length - title.length - tweetEnd.length - 9;
    return divideTweet(content, maxLength).map((tweetBody, index, arr) =>
      companyIdentifier +
      title +
      (arr.length > 1 ? ` (${index + 1}/${arr.length})\n` : '\n') +
      tweetBody +
      tweetEnd
    );
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

  const postTwitterId = (pg_tweet_id, twitter_id) => knex('twitter_ids').insert({ pg_tweet_id, twitter_id });

  const postToTwitter = (pg_tweet_id, status) => twit.post('statuses/update', { status }, (err, response) => {
    if (err) { console.log('Error while posting to Twitter: ', err); }
    else { postTwitterId(pg_tweet_id, response.id).then(() => {}); }
  });

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
