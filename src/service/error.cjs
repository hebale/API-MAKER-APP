const error = ({ app }) => {
  app.use((_, res) => {
    res.status(404).send('Not Found');
  });
  app.use(function (_, _, res) {
    res.status(500).send('Internal Server Error');
  });
};

module.exports = error;
