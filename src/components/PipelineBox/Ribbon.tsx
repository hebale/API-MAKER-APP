import { useState, useEffect, useContext } from 'react';
import { FormGroup, FormLabel, Box, Select, MenuItem } from '@mui/material';
import { getApiList, getApi } from '~/api';
import { ApiDispatchContext } from '~/components/PipelineBox';
import useUserHistory from '~/hooks/useUserHistory';
import type { SelectChangeEvent } from '@mui/material';
import type { ApiData } from '~/types/components';

const Ribbon = () => {
  const { getSelectedPipelineHistory, setSelectedPipelineHistory } =
    useUserHistory();
  const { update, reset } = useContext(ApiDispatchContext);
  const [selected, setSelected] = useState(
    getSelectedPipelineHistory() ?? 'none'
  );
  const { data: apis, dataUpdatedAt: getApiListUpdatedAt } = getApiList();
  const {
    data: selectedApi,
    isError,
    dataUpdatedAt: getApiUpdatedAt,
  } = getApi(selected, {
    enabled: selected !== 'none',
  });

  if (isError) {
    setSelected('none');
    setSelectedPipelineHistory('');
  }

  useEffect(() => {
    if (!apis?.includes(selected)) {
      setSelected('none');
      reset();
    }
  }, [getApiListUpdatedAt]);

  useEffect(() => {
    if (selectedApi) {
      const api = selectedApi as ApiData;
      update({ ...api, methods: Object.keys(api.methods) } as ApiData & {
        methods: string[];
      });
    }
  }, [getApiUpdatedAt]);

  const onChangeApiSelect = (e: SelectChangeEvent<string>) => {
    setSelectedPipelineHistory(e.target.value);
    setSelected(e.target.value);
  };

  return (
    <Box className="ribbon">
      <FormGroup>
        <FormLabel>Select API</FormLabel>
        <Select
          disabled={apis?.length === 0}
          value={selected}
          onChange={onChangeApiSelect}
        >
          <MenuItem value="none" disabled>
            선택
          </MenuItem>
          {apis &&
            apis.map((api) => (
              <MenuItem key={api} value={api}>
                {api}
              </MenuItem>
            ))}
        </Select>
      </FormGroup>
    </Box>
  );
};

export default Ribbon;
