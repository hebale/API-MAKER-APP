import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { getAllApis } from '~/api';
import ListItem from './ListItem';
import SearchBar from '~/components/SearchBar';
import type { ApiData } from '~/types/components';

const ApiBox = () => {
  const { data, dataUpdatedAt } = getAllApis();
  const [searchParam] = useSearchParams();
  const location = useLocation();
  const [apis, setApis] = useState<ApiData[]>();

  useEffect(() => {
    const keyword = searchParam.get('search') ?? '';
    const filter = (
      !!searchParam.get('methods') ? searchParam.get('methods')?.split(',') : []
    ) as string[];

    setApis(
      data?.filter((api) => {
        const { path, methods, description } = api;
        return (
          (path.indexOf(keyword) > -1 || description?.indexOf(keyword) > -1) &&
          // !Object.keys(methods).length) ||
          Object.keys(methods).some((method) => filter.indexOf(method) > -1)
        );
        // )
      })
    );
  }, [dataUpdatedAt, location.search]);

  return (
    <>
      <SearchBar />
      {apis && apis.length > 0 ? (
        apis.map((api) => <ListItem key={api.path} data={api} />)
      ) : (
        <Box className="empty-box">검색된 API가 없습니다.</Box>
      )}
    </>
  );
};

export default ApiBox;
