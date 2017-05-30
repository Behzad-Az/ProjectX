const postSearchBarResults = (req, res, esClient) => {

  const profanityRegEx = new RegExp(['fuck', 'dick', 'asshole', 'bitch', 'motherfucker'].join('|'));
  const query = req.body.query.trim();
  const searchType = req.body.searchType;

  const validateInputs = () => new Promise((resolve, reject) => {
    if (
      query.length >= 3 && query.length <= 20 &&
      query.search(/[^a-zA-Z0-9\_\#]/) == -1 &&
      !profanityRegEx.test(query) &&
      ['companyHashtag'].includes(searchType)
    ) {
      resolve();
    } else {
      reject('Invalid search query.');
    }
  });


  validateInputs()
  .then(() => {
    switch (searchType) {
      case 'companyHashtag':
        const body = {
          size: 5,
          from: 0,
          query: {
            bool: {
              must: {
                multi_match: {
                  query,
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
      default:
        throw 'Unknow query type';
    }
  })
  .then (results => {
    switch (searchType) {
      case 'companyHashtag':
        res.send({
          searchResults: results.hits.hits
        });
        break;
    }
  })
  .catch(err => {
    console.error('Error inside postSearchBarResults.js: ', err);
    res.send(false);
  });

};

module.exports = postSearchBarResults;
