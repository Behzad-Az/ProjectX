const postNewTweet = (req, res, knex, twit) => {

  const poster_name = req.body.posterName.trim() || 'Anonymous';
  const plant_name = req.body.plantName.trim() || 'Unknown_Plant';
  const country = req.body.country.trim() || 'Unknown_Country';
  const content = req.body.content.trim();
  const tweetEnd = ` @Shell #Shell #${plant_name} #${country}`;

  let newTweetObj = {
    poster_name,
    plant_name,
    country,
    content,
    hashtags: `#${poster_name} #${plant_name} #${country}`
  };

  const figureOutTwtArr = () => {
    let contentLength = content.length;
    let tweetEndLength = tweetEnd.length;
    let availableLength = 140 - tweetEndLength - 2;
    let numberOfTweets = Math.ceil(contentLength / availableLength);
    let tweetArr = [];
    for (let i = 0; i < numberOfTweets; i++) {
      let tweet = content.slice(i * availableLength, (i + 1) * availableLength - 1) + ' -\n' + tweetEnd;
      tweetArr.push(tweet);
    }
    return tweetArr;
  };

  figureOutTwtArr().forEach(status => {
    console.log("status length: ", status.length);
    twit.post('statuses/update', { status }, err => console.error('Twitter Error: ', err || 'posted - no error'));
  });

  knex('tweets').insert(newTweetObj)
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside postNewTweet.js: ', err);
    res.send(false);
  });

};

module.exports = postNewTweet;
