const getIndexPageData = (req, res, knex, esClient) => {

  const companyNameQuery = req.query.company.trim();

  const validateInputs = () => new Promise((resolve, reject) => {
    if (
      companyNameQuery.length >= 3 && companyNameQuery.length <= 20 &&
      companyNameQuery.search(/[^a-zA-Z0-9\_]/) == -1
    ) {
      resolve();
    } else {
      reject('Invalid companyNameQuery.');
    }
  });

  const getAllTweets = () => knex('pg_tweets')
    .select('id', 'poster_name', 'company_hashtag', 'work_location_hashtag', 'content', 'like_count', 'created_at')
    .whereNull('deleted_at')
    .orderBy('created_at', 'desc')
    .limit(10)
    .offset(req.query.tweetsoffset);

  const getCompanyIds = () => {
    const body = {
      size: 5,
      from: 0,
      query: {
        bool: {
          must: {
            multi_match: {
              query: companyNameQuery,
              fields: ['company_name', 'company_hashtag'],
              fuzziness: 'AUTO'
            }
          },
          filter: {
            type: { value: 'company' }
          }
        }
      }
    };
    return esClient.search({ index: 'worker_vent', body });
  };

  const getCompnayFilteredTweets = companyIds => knex('pg_tweets')
    .select('id', 'poster_name', 'company_hashtag', 'work_location_hashtag', 'content', 'like_count', 'created_at')
    .whereIn('company_id', companyIds)
    .whereNull('deleted_at')
    .orderBy('created_at', 'desc')
    .limit(10)
    .offset(req.query.tweetsoffset);

  validateInputs()
  .then(() => companyNameQuery === '_all' ? getAllTweets() : getCompanyIds())
  .then(results => companyNameQuery === '_all' ? results : getCompnayFilteredTweets(results.hits.hits.map(company => company._id)))
  .then(tweets => res.send({ tweets }))
  .catch(err => {
    console.error('Error inside getIndexPageData.js: ', err);
    res.send(false);
  });

};

module.exports = getIndexPageData;

