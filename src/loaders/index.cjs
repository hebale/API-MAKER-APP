const $path = require('path');
const $express = require('express');
const $cors = require('cors');
const $bodyParser = require('body-parser');

const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const compiler = webpack(require('../config/webpack.config.cjs'));

const loader = ({ app }) => {
  app.use(
    $cors({
      origin: '*',
      credentials: true,
    })
  );
  app.use(middleware(compiler));
  app.use($bodyParser.json());
  app.use($bodyParser.urlencoded({ extended: false }));
  app.use($express.static($path.join(__dirname, '../public')));
};

module.exports = loader;
