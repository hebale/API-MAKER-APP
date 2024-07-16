import React, { useState, useEffect, useRef } from 'react';
import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Stack,
  Checkbox,
  OutlinedInput,
  IconButton,
} from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { deepClone } from '~/utils';

export type MapInputProps = {
  data?: MapData[];
  useCheck?: boolean;
  onChange: (data: MapData[]) => void;
};

export type MapData = {
  uuid: string;
  isActive: boolean;
  key: string;
  value: string;
  [key: string]: string | boolean;
};

const createMapInput = () => ({
  uuid: String(performance.now()),
  isActive: false,
  key: '',
  value: '',
});

const MapInput = ({ data, useCheck = true, onChange }: MapInputProps) => {
  const [mapData, setMapData] = useState<MapData[]>([]);
  const focusInput = useRef<HTMLInputElement[]>([]);
  const focusIndex = useRef<number | null>(null);

  useEffect(() => {
    if (focusIndex.current !== null) {
      focusInput.current[focusIndex.current].focus();
      focusIndex.current = null;
    }

    if (data) {
      return setMapData(deepClone(data).concat(createMapInput()));
    }

    if (!mapData.length || mapData.at(-1)?.key) {
      setMapData((prev) => prev.concat(createMapInput()));
    }

    onChange(mapData);
  }, [data ?? mapData]);

  const exportData = (mapData: MapData[]) => {
    setMapData(() => {
      if (data) onChange(mapData.slice(0, mapData.length - 1));
      return mapData;
    });
  };

  const onChangeUsage = (
    e: React.ChangeEvent<HTMLInputElement>,
    uuid: string
  ) => {
    exportData(
      mapData.map((data) => {
        if (data.uuid === uuid) data.isActive = e.target.checked;
        return data;
      })
    );
  };
  const onChangeData = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    uuid: string,
    key: string
  ) => {
    const index = mapData.findIndex((data) => data.uuid === uuid);

    exportData(
      (() => {
        const changedMapData = mapData.map((data) => {
          if (data.uuid === uuid) {
            data[key] = e.target.value;
          }
          return data;
        });

        return mapData.length - 1 === index
          ? changedMapData.concat(createMapInput() as MapData)
          : changedMapData;
      })()
    );
  };

  const onRemoveRow = (uuid: string) => {
    exportData(mapData.filter((data) => data.uuid !== uuid));
  };

  const onFocusData = (index: number) => {
    focusIndex.current = index;
  };
  const onBlurData = () => {
    focusIndex.current = null;
  };

  return (
    <>
      <TableContainer className="map-input">
        <Table padding="none">
          <TableBody>
            {mapData.map(({ uuid, isActive, key, value }, index) => (
              <TableRow key={uuid}>
                {useCheck && (
                  <TableCell>
                    <Checkbox
                      tabIndex={-1}
                      checked={isActive}
                      disabled={!key}
                      onChange={(e) => onChangeUsage(e, uuid)}
                    />
                  </TableCell>
                )}
                <TableCell>
                  <Stack direction="row">
                    <OutlinedInput
                      inputRef={(element) => {
                        if (element) {
                          focusInput.current[index * 2] = element;
                        }
                      }}
                      size="small"
                      placeholder="key"
                      defaultValue={key}
                      onFocus={() => onFocusData(index * 2)}
                      onChange={(e) => onChangeData(e, uuid, 'key')}
                      onBlur={onBlurData}
                    />
                    <OutlinedInput
                      inputRef={(element) => {
                        if (element) {
                          focusInput.current[index * 2 + 1] = element;
                        }
                      }}
                      size="small"
                      placeholder="value"
                      defaultValue={value}
                      onFocus={() => onFocusData(index * 2 + 1)}
                      onChange={(e) => onChangeData(e, uuid, 'value')}
                      onBlur={onBlurData}
                    />
                    <div>
                      {mapData.length !== 1 && mapData.length - 1 !== index && (
                        <IconButton
                          tabIndex={-1}
                          // color="error"
                          onClick={() => onRemoveRow(uuid)}
                        >
                          <RemoveCircleIcon />
                        </IconButton>
                      )}
                    </div>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default MapInput;
