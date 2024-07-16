const queryKeys = {
  all: ['all'],
  list: ['list'],
  api: (path: string) => ['api', path],
  test: (path: string) => ['test', path],
};

export default queryKeys;
