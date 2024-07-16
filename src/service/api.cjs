const $fs = require('fs');
const $path = require('path');
const { glob } = require('glob');
const { format } = require('date-fns');
const root = $path.resolve(process.cwd(), './src/json');

const statusMessage = {
  200: 'Ok',
  304: 'Not Modified',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  408: 'Request Timeout',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  505: 'HTTP Version Not Supported',
};
const clients = [];

const api = ({ app }) => {
  app.get('/sse', (_, res) => {
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });

    clients.push(res);
  });

  app.use('/*', (req, res) => {
    try {
      const filePath = glob.sync(`${$path.join(root, req.baseUrl)}/index.json`);
      if (!filePath.length) throw { code: 404, message: statusMessage['404'] };

      const response = $fs.readFileSync(
        $path.resolve(process.cwd(), filePath[0]),
        {
          encoding: 'utf-8',
          flag: 'r',
        }
      );

      const json = JSON.parse(response);
      const settings = json.methods[req.method];
      const pipeline = json.pipeline[req.method];

      if (!settings) throw { code: 405, message: statusMessage['405'] };

      const { headers } = json;
      const { delay, status } = settings;
      const { isActive, value } = pipeline;

      const data = (() => {
        try {
          if (!isActive) return json.response;

          const request = value
            .slice(value.indexOf('(') + 1, value.indexOf(')'))
            .split(',')[0]
            .trim();
          const code = value.slice(
            value.indexOf('{') + 1,
            value.lastIndexOf('}')
          );

          const getResponse = () => json.response;
          const setResponse = (callback) => {
            $fs.writeFileSync(
              $path.join(
                $path.resolve(process.cwd(), `./src/json${json.path}`),
                '/index.json'
              ),
              JSON.stringify(
                { ...json, response: callback(json.response) },
                null,
                2
              )
            );
          };

          const fn = new Function(request, 'get', 'set', code);
          const result = fn(
            { query: req.query, body: req.body },
            getResponse,
            setResponse
          );

          return result;
        } catch (err) {
          return new Error(err);
        }
      })();

      if (data instanceof Error) {
        return res
          .status(400)
          .send(`<p>Pipeline ${data.message}</p>\n<pre>${value}</pre>`);
      }

      for (let i = 0; i < headers.length; i++) {
        if (headers[i].isActive) {
          const { key, value } = headers[i];
          res.append(key, value);
        }
      }

      clients.forEach((client) => {
        const logData = {
          ip: req.ip,
          method: req.method,
          path: req.baseUrl,
          query: Object.keys(req.query)
            .map((value) => `${value}=${req.query[value]}`)
            .join('&'),
          body: Object.keys(req.body).length > 0 ? req.body : '',
          response: Object.keys(data).length > 0 ? data : '',
          timeStamp: format(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        };

        client.write(
          `id: ${new Date().getTime()}\nevent: log\ndata: ${JSON.stringify(
            logData
          )}\n\n`
        );
      });

      setTimeout(() => {
        res.status(status).send(status === 200 ? data : '');
      }, delay);
    } catch (err) {
      res.status(err.code).send(err);
    }
  });
};

module.exports = api;
