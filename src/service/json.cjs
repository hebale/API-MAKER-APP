const $fs = require('fs');
const $path = require('path');
const { glob: $glob } = require('glob');
const defaultCode = `function pipeline(request, get, set) {\n\t// const { query, body} = request 요청정보\n\t// const data = get(); 데이터 가저오기\n\t// set((prev) => prev); 데이터 업데이트\n\treturn get();\n}`;

const hasDir = (path) => {
  try {
    return $fs.lstatSync(path);
  } catch (err) {
    return false;
  }
};
const root = $path.resolve(process.cwd(), './src/json');
const getBasePath = (path) => $path.resolve(process.cwd(), `./src/json${path}`);
const getJsonData = (path) => {
  const response = $fs.readFileSync(`${path}/index.json`, {
    encoding: 'utf-8',
    flag: 'r',
  });
  return JSON.parse(response);
};
const setJsonData = (path, json) => {
  $fs.writeFileSync(
    $path.join(path, '/index.json'),
    JSON.stringify(json, null, 2)
  );
};
const removeEmptyFolder = (path) => {
  const files = $fs.readdirSync(path);

  if (path === root || files.length > 0) return;
  $fs.rmdirSync(path);

  const parentPath = $path.resolve(path, '..');
  removeEmptyFolder(parentPath);
};
const createJson = (path, data) => {
  if (hasDir(path)) return false;

  $fs.mkdirSync(path, { recursive: true });
  setJsonData(path, data);
  return true;
};
const removeJson = (path) => {
  try {
    $fs.rmSync(`${path}/index.json`);
    removeEmptyFolder(path);
    return true;
  } catch (err) {
    return false;
  }
};

const json = ({ app }) => {
  app.post('/api/v1/json/test', (req, res) => {
    try {
      const { path, method, body } = req.body;
      const basePath = getBasePath(path);
      let { pipeline, response } = getJsonData(basePath);

      const data = (() => {
        try {
          const { value } = pipeline[method];
          const request = value
            .slice(value.indexOf('(') + 1, value.indexOf(')'))
            .split(',')[0]
            .trim();
          const code = value.slice(
            value.indexOf('{') + 1,
            value.lastIndexOf('}')
          );

          const getResponse = () => response;
          const setResponse = (callback) => {
            response = callback(response);
          };

          const fn = new Function(request, 'get', 'set', code);
          const result = fn(
            { query: req.query, body },
            getResponse,
            setResponse
          );

          return {
            response,
            result,
          };
        } catch (err) {
          return new Error(err);
        }
      })();

      data instanceof Error
        ? res.status(400).send('Pipeline 코드 오류')
        : res.send(data);
    } catch (err) {
      res.status(500).send('Internal Server Error');
    }
  });

  app.get('/api/v1/json/all', async (_, res) => {
    try {
      const filePaths = $glob.sync(`${root}/**/*.json`, { nodir: true });
      const allJsons = [];

      filePaths.forEach((filePath) => {
        const response = $fs.readFileSync(
          $path.resolve(process.cwd(), filePath),
          {
            encoding: 'utf-8',
            flag: 'r',
          }
        );
        const data = JSON.parse(response);

        allJsons.push(data);
      });

      res.send({
        code: 200,
        message: 'Ok',
        data: allJsons,
      });
    } catch (err) {
      res.status(500).send('Internal Server Error');
    }
  });

  app.get('/api/v1/json/list', async (_, res) => {
    try {
      const filePath = $glob.sync(`${root}/**/*.json`, { nodir: true });
      const data = filePath.map((path) => {
        const splited = path.split($path.sep);
        return `/${splited.slice(2, splited.length - 1).join('/')}`;
      });

      res.send({
        code: 200,
        message: 'Ok',
        data,
      });
    } catch (err) {
      res.status(500).send('Internal Server Error');
    }
  });

  app.get('/api/v1/json/download', (req, res) => {
    try {
      const { path } = req.query;
      const basePath = getBasePath(path);

      res.sendFile(`${basePath}/index.json`);
    } catch (err) {
      res.status(500).send('Internal Server Error');
    }
  });

  app.use('/api/v1/json/:id', (req, res) => {
    try {
      const { path, key, data } = req.body;
      const basePath = getBasePath(path);
      const jsonData = getJsonData(basePath);
      const id = req.params.id;

      switch (req.method) {
        case 'POST':
        case 'PUT':
        case 'PATCH':
          if (id === 'path') {
            const filePath = $glob.sync(`${root}/**/*.json`, {
              nodir: true,
            });
            const lists = filePath.map((path) => {
              const splited = path.split($path.sep);
              return `/${splited.slice(2, splited.length - 1).join('/')}`;
            });

            if (lists.indexOf(data) > -1) {
              return res.status(400).send('동일한 API path가 존재합니다.');
            }

            createJson(getBasePath(data), { ...jsonData, path: data });
            removeJson(basePath);

            return res.send({
              code: 200,
              message: 'Ok',
            });
          }

          setJsonData(basePath, {
            ...jsonData,
            updatedDate: new Date().toISOString(),
            [id]: (() => {
              if (id === 'headers') {
                return [
                  ...jsonData[id].slice(0, key),
                  ...(req.method === 'POST' ? data : [data]),
                  ...jsonData[id].slice(key + (req.method !== 'POST')),
                ];
              } else if (id === 'methods') {
                return {
                  ...jsonData[id],
                  [key]: data,
                };
              } else if (id === 'pipeline') {
                return {
                  ...jsonData[id],
                  [key]: data.hasOwnProperty('value')
                    ? data
                    : { ...data, value: defaultCode },
                };
              } else {
                return JSON.parse(data);
              }
            })(),
            ...(id === 'methods' &&
              data && {
                pipeline: {
                  ...jsonData.pipeline,
                  [key]: { isActive: false, value: defaultCode },
                },
              }),
          });
          break;

        case 'DELETE':
          setJsonData(basePath, {
            ...jsonData,
            [id]: (() => {
              if (id === 'headers') {
                return [
                  ...jsonData[id].slice(0, key),
                  ...jsonData[id].slice(key + 1),
                ];
              } else {
                delete jsonData[id][key];
                delete jsonData.pipeline[key];
                return jsonData[id];
              }
            })(),
          });
          break;
        default:
          res.status(400).send('잘못된 Method 요청입니다.');
      }

      res.send({
        code: 200,
        message: 'Ok',
      });
    } catch (err) {
      res.status(500).send('Internal Server Error');
    }
  });

  app.use('/api/v1/json', (req, res) => {
    try {
      const { path, data } = req.body;

      const basePath = (() => {
        if (req.method === 'GET') return req.query.path;
        return path ? getBasePath(path) : getBasePath(data.path);
      })();

      switch (req.method) {
        case 'GET':
          const jsonData = getJsonData(getBasePath(basePath));

          return res.send({
            code: 200,
            message: 'Ok',
            data: jsonData,
          });

        case 'POST':
          data.createdDate = new Date().toISOString();

          const pipeline = Object.keys(data.methods).reduce((acc, method) => {
            acc[method] = {
              isActive: false,
              value: defaultCode,
            };
            return acc;
          }, {});

          if (!createJson(basePath, { ...data, pipeline }))
            throw new Error('api create failed!');
          break;

        case 'PATCH':
          data.updatedDate = new Date().toISOString();
          if (!createJson(basePath, data))
            throw new Error('api create failed!');
          break;

        case 'PUT':
          removeJson(basePath);
          createJson(getBasePath(data.path), {
            ...data,
            updatedDate: new Date().toISOString(),
          });

          break;
        case 'DELETE':
          if (!removeJson(basePath)) throw new Error('api remove failed');
          break;
      }

      res.send({
        code: 200,
        message: 'Ok',
      });
    } catch (err) {
      res.status(500).send('Internal Server Error');
    }
  });
};

module.exports = json;
