'use strict';

const fs = require('fs');
const elasticsearch = require('elasticsearch');
const esClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
});

const deleteIndex = {
  index: 'worker_vent'
};

const newIndex = {
  index: 'worker_vent',
  body: {
    'mappings': {
      'comapny': {
        'properties': {
          'company_name': { 'type': 'string' }
        }
      }
    }
  }
};

const bulkIndex = (index, type, data) => {
  let bulkBody = [];

  data.forEach(item => {
    bulkBody.push({
      index: {
        _index: index,
        _type: type
      }
    });
    bulkBody.push(item);
  });

  esClient.bulk({body: bulkBody})
  .then(response => {
    let errorCount = 0;
    response.items.forEach(item => {
      if (item.index && item.index.error) {
        console.log(++errorCount, item.index.error);
      }
    });
    console.log(`Successfully indexed ${data.length - errorCount} out of ${data.length} items`);
  })
  .catch(console.err);
};


const populateElasticData = () => {
  const companiesRaw = fs.readFileSync('companies.json');
  const companies = JSON.parse(companiesRaw);
  console.log(`${companies.length} items parsed from data file`);
  bulkIndex('worker_vent', 'company', companies);
};

esClient.indices.delete(deleteIndex)
.then(() => esClient.indices.create(newIndex))
.then(() => populateElasticData());
