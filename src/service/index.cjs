const json = require('./json.cjs');
const error = require('./error.cjs');
const api = require('./api.cjs');

const service = ({ app }) => {
  app
    .get('/', (_, res) => {
      res.type('html');
      res.sendFile(path.resolve(__dirname, '../index.html'));
    })
    .on('error', (err) => {
      process.exit(1);
    });

  json({ app });
  api({ app });
  error({ app });
};

module.exports = service;
