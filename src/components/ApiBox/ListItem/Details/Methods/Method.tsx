import React, { useState, useEffect, memo } from 'react';
import {
  Stack,
  Checkbox,
  OutlinedInput,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import { deepClone, isSameData } from '~/utils';
import type { SelectChangeEvent } from '@mui/material';
import type { MethodProps, MethodData } from '.';

export type MethodControl = {
  isActive: boolean;
  name: string;
  delay: number;
  status: number;
};

const statusCodes = [200, 304, 400, 401, 403, 405, 408, 500, 501, 505];

const Method = ({ data, onChange }: MethodProps) => {
  const [methodData, setMethodData] = useState<MethodData>();

  useEffect(() => {
    setMethodData(deepClone(data));
  }, [data]);

  const exportData = (data: MethodData) => {
    setMethodData(() => {
      onChange(data);
      return data;
    });
  };

  const onChangeUsage = (e: React.ChangeEvent<HTMLInputElement>) =>
    methodData && exportData({ ...methodData, isActive: e.target.checked });

  const onChangeDelay = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) =>
    methodData && exportData({ ...methodData, delay: Number(e.target.value) });

  const onChangeStatus = (e: SelectChangeEvent<number>) =>
    methodData && exportData({ ...methodData, status: Number(e.target.value) });

  return (
    methodData && (
      <Stack
        className="method-stack"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Checkbox
          tabIndex={-1}
          checked={methodData.isActive}
          onChange={(e) => onChangeUsage(e)}
        />
        <Typography>{methodData.name}</Typography>

        <Stack direction="row">
          <OutlinedInput
            type="number"
            disabled={!methodData.isActive}
            value={methodData.delay ?? 0}
            inputProps={{
              min: 0,
              step: 500,
            }}
            onKeyDown={(e) => e.preventDefault()}
            onChange={(e) => onChangeDelay(e)}
          />
          <Select
            disabled={!methodData.isActive}
            value={methodData.status ?? 200}
            onChange={(e) => onChangeStatus(e)}
          >
            {statusCodes.map((code) => (
              <MenuItem key={code} value={code}>
                {code}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </Stack>
    )
  );
};

export default memo(Method, isSameData);
