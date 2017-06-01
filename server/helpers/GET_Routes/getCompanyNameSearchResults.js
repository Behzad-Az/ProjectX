const getCompanyNameSearchResults = (req, res, esClient) => {

  const profanityRegEx = new RegExp(['fuck', 'dick', 'asshole', 'bitch', 'motherfucker'].join('|'));
  const companyNameQuery = req.query.company.trim();

  const validateInputs = () => new Promise((resolve, reject) => {
    if (
      companyNameQuery.length >= 2 && companyNameQuery.length <= 20 &&
      companyNameQuery.search(/[^a-zA-Z0-9\ \_]/) == -1 &&
      !profanityRegEx.test(companyNameQuery)
    ) {
      resolve();
    } else {
      reject('Invalid companyNameQuery.');
    }
  });

  validateInputs()
  .then(() => {
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
  })
  .then(results => res.send({ searchResults: results.hits.hits }))
  .catch(err => {
    console.error('Error inside getCompanyNameSearchResults.js: ', err);
    res.send(false);
  });

};

module.exports = getCompanyNameSearchResults;
