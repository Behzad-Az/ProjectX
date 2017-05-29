const postSearchBarResults = (req, res, esClient) => {

  const profanityRegEx = new RegExp(['fuck', 'dick', 'asshole', 'bitch', 'motherfucker'].join('|'));
  const query = req.body.query.trim();
  const searchType = req.body.searchType;

  const validateInputs = () => new Promise((resolve, reject) => {
    if (
      query.length >= 3 && query.length <= 20 &&
      query.search(/[^a-zA-Z0-9\&\_\'\.]/) == -1 &&
      !profanityRegEx.test(query) &&
      ['companyName'].includes(searchType)
    ) {
      resolve();
    } else {
      reject('Invalid search query.');
    }
  });

  const companySearchBody = {
    size: 5,
    from: 0,
    query: {
      bool: {
        must: {
          multi_match: {
            query,
            fields: ['company_name'],
            fuzziness: 'AUTO'
          }
        },
        filter: {
          type: { value: 'company' }
        }
      }
    }
  };

  const search = (index, body) => esClient.search({ index, body });

  validateInputs()
  .then(() => {
    console.log("i'm here 6: ", query);
    switch (searchType) {
      case 'companyName':
        return search('worker_vent', companySearchBody);
      default:
        throw 'Unknow query type';
    }
  })
  .then (results => {
    console.log("i'm here 6: ", results);
    switch (searchType) {
      case 'companyName':
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
