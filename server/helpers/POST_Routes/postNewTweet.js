const postNewTweet = (req, res, knex, twit) => {
  const MAX_CHAR_COUNT = 140;
  const profanityRegEx = new RegExp(['fuck', 'dick', 'asshole', 'bitch', 'motherfucker'].join('|'));

  const determineWorkEnviro = () => {
    switch(req.body.workEnviro) {
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

  const poster_name = req.body.posterName.trim() || 'Anonymous';
  const location = req.body.location.trim().replace(/ /g, '_');
  const company = req.body.company.trim().replace(/ /g, '_');
  const work_enviro = determineWorkEnviro();
  const content = req.body.content.trim();

  const validateLocation = () => {
    if (location) {
      return location.length >= 3 && location.length <=15 &&
             location.search(/[^a-zA-Z0-9\&\_\'\.]/) == -1 &&
             !profanityRegEx.test(location);
    } else {
      return true;
    }
  };

  const validateInputs = () => new Promise((resolve, reject) => {
    if (
      poster_name.length >= 3 && poster_name.length <= 15 &&
      poster_name.search(/[^a-zA-Z0-9\ \&\_\'\.]/) == -1 &&
      !profanityRegEx.test(poster_name) &&
      validateLocation(location) &&
      company.length >= 3 && company.length <= 20 &&
      company.search(/[^a-zA-Z0-9\&\_\'\.]/) == -1 &&
      !profanityRegEx.test(company) &&
      [' #awesome', ' #cool', ' #funny', ' #sucks', ''].includes(work_enviro) &&
      content.length >= 3 && content.length <= 500 &&
      content.search(/[^a-zA-Z0-9\ \&\*\(\)\_\-\~\:\"\'\,\.\[\]\|]/) == -1 &&
      !profanityRegEx.test(content)
    ) {
      resolve();
    } else {
      reject('Invalid form entries');
    }
  });

  const divideTweet = (content, sliceLength, tweetBodyArr = []) => {
    let tweetBody = content.slice(0, sliceLength);
    if (content.length < sliceLength) {
      tweetBodyArr.push(tweetBody);
      return tweetBodyArr;
    } else {
      let lastSpaceIndex = tweetBody.lastIndexOf(' ');
      tweetBody = tweetBody.slice(0, lastSpaceIndex);
      tweetBodyArr.push(tweetBody + '_');
      return divideTweet(content.replace(tweetBody + ' ', ''), sliceLength, tweetBodyArr);
    }
  };

  const determineTwtArr = () => {
    const companyIdentifier = `#${company}` + (location ? ` #${location}` : '');
    const tweetEnd = '\n#WorkerVent';
    const sliceLength = MAX_CHAR_COUNT - companyIdentifier.length - work_enviro.length - tweetEnd.length - 9;
    return divideTweet(content, sliceLength).map((tweetBody, index, arr) =>
      companyIdentifier +
      work_enviro +
      (arr.length > 1 ? ` (${index + 1}/${arr.length})\n` : '\n') +
      tweetBody +
      tweetEnd
    );
  };

  const insertNewVent = newVentObj => knex('pg_tweets')
    .insert(newVentObj)
    .returning('id');

  const insertTwitterId = (pg_tweet_id, twitter_id) => knex('twitter_ids').insert({ pg_tweet_id, twitter_id });

  const postToTwitter = (pg_tweet_id, status) => twit.post('statuses/update', { status }, (err, response) => {
    if (err) { console.log('Error while posting to Twitter: ', err); }
    else { insertTwitterId(pg_tweet_id, response.id).then(() => {}); }
  });

  validateInputs()
  .then(() => insertNewVent({
    poster_name,
    location,
    company,
    work_enviro,
    content
  }))
  .then(id => {
    res.send(true);
    // determineTwtArr().forEach(status => postToTwitter(id[0], status));
  })
  .catch(err => {
    console.error('Error inside postNewTweet.js', err);
    res.send(false);
  });

};

module.exports = postNewTweet;
