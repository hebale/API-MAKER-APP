const useUserHistory = () => {
  const getMenuHistory = () => {
    const nowMenus = sessionStorage.getItem('menus');
    return nowMenus ? nowMenus.split(',') : ['api', 'create'];
  };
  const setMenuHistory = (menu: string) => {
    sessionStorage.setItem('menus', menu);
  };

  const isExpandedApiHistory = (path: string) => {
    const expandedApis = sessionStorage.getItem('expandedApis');
    return !!expandedApis && expandedApis.split(',').indexOf(path) > -1;
  };

  const setExpandedApiHistory = (path: string) => {
    const expandedApis = sessionStorage.getItem('expandedApis');
    sessionStorage.setItem(
      'expandedApis',
      `${expandedApis ? expandedApis + ',' + path : path}`
    );
  };

  const removeExpandedApiHistory = (path: string) => {
    const expandedApis = sessionStorage.getItem('expandedApis');

    if (expandedApis) {
      sessionStorage.setItem(
        'expandedApis',
        expandedApis
          .split(',')
          .filter((_path) => _path !== path)
          .join(',')
      );
    }
  };

  const getSelectedPipelineHistory = () => {
    return sessionStorage.getItem('selectedPipeline');
  };

  const setSelectedPipelineHistory = (path: string) => {
    !!path
      ? sessionStorage.setItem('selectedPipeline', path)
      : sessionStorage.removeItem('selectedPipeline');
  };

  return {
    getMenuHistory,
    setMenuHistory,
    isExpandedApiHistory,
    setExpandedApiHistory,
    removeExpandedApiHistory,
    getSelectedPipelineHistory,
    setSelectedPipelineHistory,
  };
};

export default useUserHistory;
