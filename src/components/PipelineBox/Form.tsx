import React, { useState, useEffect } from 'react';
import {
  Stack,
  FormGroup,
  FormLabel,
  FormControl,
  FormControlLabel,
  ToggleButtonGroup,
  ToggleButton,
  Switch,
  Select,
  MenuItem,
} from '@mui/material';

import { getApiList, getApi } from '~/api';
import type { ApiData } from '~/api';
import type { SelectChangeEvent } from '@mui/material';
import Monaco from '~/features/Monaco';

const Form = () => {
  const { data: apiList } = getApiList();
  const [selectedApi, setSelectedApi] = useState<string>('none');
  const [apiData, setApiData] = useState<ApiData>();
  const { data } = getApi(selectedApi, { enabled: selectedApi !== 'none' });

  useEffect(() => {
    if (data) setApiData(data);
  }, [data]);

  const onChangeApi = (e: SelectChangeEvent<HTMLInputElement>) =>
    setSelectedApi((e.target as HTMLInputElement).value);

  const onChangeMethod = () => {};

  const onChangeCode = () => {};

  return (
    <>
      <Stack direction="row">
        <FormGroup>
          <FormControlLabel control={<Switch defaultChecked />} label="Usage" />
          <Select value={selectedApi} onChange={onChangeApi}>
            <MenuItem value="none" selected disabled>
              none
            </MenuItem>
            {apiList &&
              apiList.map((path: string) => (
                <MenuItem key={path} value={path}>
                  {path}
                </MenuItem>
              ))}
          </Select>
        </FormGroup>
      </Stack>
      {apiData && (
        <ToggleButtonGroup
          color="primary"
          value={''}
          onChange={onChangeMethod}
          exclusive
        >
          {Object.keys(apiData.methods).map((method) => (
            <ToggleButton key={method} value={method}>
              {method}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      )}
      <Monaco
        value={''}
        onChange={onChangeCode}
        // onValidate={onResponseValidate}
      />
    </>
  );
};

export default Form;
