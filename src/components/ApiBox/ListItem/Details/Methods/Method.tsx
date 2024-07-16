import { useState, useEffect, memo } from 'react';
import {
  Stack,
  Checkbox,
  OutlinedInput,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import SwitchButton from '~/features/SwitchButton';
import { deepClone, isSameData } from '~/utils';
import useModal from '~/hooks/useModal';
import type { ChangeEvent } from 'react';
import type { SelectChangeEvent } from '@mui/material';
import type { MethodProps, MethodData } from '.';

export type MethodControl = {
  isActive: boolean;
  name: string;
  delay: number;
  status: number;
  pipeline: boolean;
};

export type ExcludedMethodData = MethodData & { pipeline: boolean };

const statusCodes = [200, 304, 400, 401, 403, 405, 408, 500, 501, 505];

const Method = ({ data, onChange }: MethodProps) => {
  const [methodData, setMethodData] = useState<ExcludedMethodData>();
  const { openModal } = useModal();

  useEffect(() => {
    setMethodData(deepClone(data));
  }, [data]);

  const exportData = (data: ExcludedMethodData) => {
    setMethodData(() => {
      onChange(data);
      return data;
    });
  };

  const onChangeUsage = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!methodData) return;
    const isActive = e.target.checked;

    if (!isActive) {
      const flag = await openModal({
        type: 'confirm',
        title: '알림',
        message:
          '해당 method에 연결된 Pipeline도 삭제됩니다. 삭제하시겠습니까?',
      });

      if (flag) exportData({ ...methodData, isActive });
    } else {
      exportData({ ...methodData, isActive });
    }
  };

  const onChangePipeline = (e: ChangeEvent<HTMLInputElement>) =>
    methodData && exportData({ ...methodData, pipeline: e.target.checked });

  const onChangeDelay = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
          <SwitchButton
            checked={methodData.pipeline}
            onChange={(e) => onChangePipeline(e)}
          />
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
