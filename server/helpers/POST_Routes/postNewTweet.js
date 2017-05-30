const postNewTweet = (req, res, knex, esClient, twit) => {
  const MAX_CHAR_COUNT = 140;
  const profanityRegEx = new RegExp(['fuck', 'dick', 'asshole', 'bitch', 'motherfucker'].join('|'));

  const determineWorkEnviro = () => {
    switch(req.body.workEnviro) {
      case 'awesome':
        return '#awesome';
      case 'alright':
        return '#cool';
      case 'funny':
        return '#funny';
      case 'sucks':
        return '#sucks';
      default:
        return '';
    }
  };

  const poster_name = req.body.posterName.trim() || 'Anonymous';
  const work_location_hashtag = req.body.workLocationHashtag;
  const company_hashtag = req.body.companyHashtag;
  const work_enviro = determineWorkEnviro();
  const content = req.body.content.trim();

  const validatePosterName = () => {
    return poster_name.length >= 3 && poster_name.length <= 15 &&
           poster_name.search(/[^a-zA-Z0-9\ \&\_\'\.]/) == -1 &&
           !profanityRegEx.test(poster_name);
  };

  const validateWorkLocation = () => {
    if (work_location_hashtag) {
      return work_location_hashtag.length >= 3 && work_location_hashtag.length <=15 &&
             work_location_hashtag.search(/[^a-zA-Z0-9\_\#]/) == -1 &&
             work_location_hashtag[0] === '#' &&
             (work_location_hashtag.match(/#/g)).length === 1 &&
             !profanityRegEx.test(work_location_hashtag);
    } else {
      return true;
    }
  };

  const validateCompany = () => {
    return company_hashtag.length >= 3 && company_hashtag.length <= 20 &&
           company_hashtag.search(/[^a-zA-Z0-9\_\#]/) == -1 &&
           company_hashtag[0] === '#' &&
           (company_hashtag.match(/#/g)).length === 1 &&
           !profanityRegEx.test(company_hashtag);
  };

  const validateContent = () => {
    return content.length >= 3 && content.length <= 500 &&
           content.search(/[^a-zA-Z0-9\ \&\*\(\)\_\-\~\:\"\'\,\.\[\]\|]/) == -1 &&
           !profanityRegEx.test(content);
  };

  const validateInputs = () => new Promise((resolve, reject) => {
    if (
      validatePosterName() &&
      validateWorkLocation() &&
      validateCompany() &&
      validateContent() &&
      ['#awesome', '#cool', '#funny', '#sucks', ''].includes(work_enviro)
    ) {
      resolve();
    } else {
      reject('Invalid form entries');
    }
  });

  const findCompanyId = () => {
    const companySearchBody = {
      size: 1,
      from: 0,
      query: {
        bool: {
          must: [
            { match: { company_hashtag } }
          ]
        }
      }
    };
    return esClient.search({ index: 'worker_vent', body: companySearchBody });
  };

  const insertNewCompany = () => new Promise((resolve, reject) => {
    const body = [
      {
        index: {
          _index: 'worker_vent',
          _type: 'company',
        }
      },
      {
        company_name: 'mv4t0j0zr6',
        company_hashtag
      }
    ];
    esClient.bulk({ body })
    .then(result => result.errors ? reject('Unable to add new company.') : resolve(result.items[0].index._id))
    .catch(err => reject(err));
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
    const companyIdentifier = `${company_hashtag} ${work_location_hashtag} ${work_enviro}`.trim();
    const tweetEnd = '\n#WorkerVent';
    const sliceLength = MAX_CHAR_COUNT - companyIdentifier.length - tweetEnd.length - 9;
    return divideTweet(content, sliceLength).map((tweetBody, index, arr) =>
      companyIdentifier +
      (arr.length > 1 ? ` (${index + 1}/${arr.length})\n` : '\n') +
      tweetBody +
      tweetEnd
    );
  };

  const insertNewVent = newVentObj => knex('pg_tweets')
    .insert(newVentObj)
    .returning('id');

  const insertTwitterId = (pg_tweet_id, twitter_id) => knex('twitter_ids')
    .insert({ pg_tweet_id, twitter_id });

  const postToTwitter = (pg_tweet_id, status) => twit.post('statuses/update', { status }, (err, response) => {
    if (err) { console.log('Error while posting to Twitter: ', err); }
    else { insertTwitterId(pg_tweet_id, response.id).then(() => {}); }
  });

  validateInputs()
  .then(() => findCompanyId())
  .then(result => result.hits.total ? result.hits.hits[0]._id : insertNewCompany())
  .then(company_id => insertNewVent({
    poster_name,
    work_location_hashtag,
    company_hashtag,
    company_id,
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
