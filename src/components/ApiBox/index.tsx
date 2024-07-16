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
      data
        ?.filter((api) => {
          const { path, methods, description } = api;

          if (!Object.keys(methods).length) return true; // method 아무 항목도 없으면 항상노출
          return (
            (path.indexOf(keyword) > -1 ||
              description?.indexOf(keyword) > -1) &&
            Object.keys(methods).some((method) => filter.indexOf(method) > -1)
          );
        })
        .sort((a, b) => {
          return a.createdDate > b.createdDate ? -1 : 1;
        })
    );
  }, [dataUpdatedAt, location.search]);

  return (
    <Box className="api-list">
      <SearchBar />
      {apis && apis.length > 0 ? (
        apis.map((api) => <ListItem key={api.path} data={api} />)
      ) : (
        <Box className="empty-box">검색된 API가 없습니다.</Box>
      )}
    </Box>
  );
};

export default ApiBox;
