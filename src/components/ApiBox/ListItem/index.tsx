import { useState, useEffect, createContext } from 'react';
import { Accordion } from '@mui/material';
import Summary from './Summary';
import Details from './Details';
import useUserHistory from '~/hooks/useUserHistory';
import type { ApiData } from '~/types/components';

type ApiDispatchProps = {
  update: (key: string, value: any) => void;
};

export const ApiContext = createContext<ApiData | null>(null);
export const ApiDispatchContext = createContext<ApiDispatchProps>({
  update: () => {},
});

const ListItems = ({ data }: { data: ApiData }) => {
  const {
    isExpandedApiHistory,
    setExpandedApiHistory,
    removeExpandedApiHistory,
  } = useUserHistory();

  const [expand, setExpand] = useState(isExpandedApiHistory(data.path));
  const [api, setApi] = useState(data);

  useEffect(() => {
    setApi(data);
  }, [data]);

  const dispatch = {
    update: (key: string, value: any) => {
      api && setApi((prev: ApiData) => ({ ...prev, [key]: value }));
    },
  };

  const onToggleExpand = () => {
    setExpand((prev) => {
      prev
        ? removeExpandedApiHistory(data.path)
        : setExpandedApiHistory(data.path);

      return !prev;
    });
  };

  return (
    <ApiContext.Provider value={api}>
      <ApiDispatchContext.Provider value={dispatch}>
        <Accordion expanded={expand ?? false}>
          <Summary onToggleExpand={onToggleExpand} />
          <Details />
        </Accordion>
      </ApiDispatchContext.Provider>
    </ApiContext.Provider>
  );
};

export default ListItems;
