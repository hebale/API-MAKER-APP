import React, { useRef, useState, useEffect, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import { Stack, Box, Typography, Button } from '@mui/material';
import FileOpenOutlinedIcon from '@mui/icons-material/FileOpenOutlined';
import useAlert from '~/hooks/useAlert';
import { inputFileReader } from '~/utils';
import type { ChangeEvent } from 'react';
import type { DropFile, DropBoxProps, DropBoxEvent } from '~/types/features';

const HiddenInput = styled('input')({
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: 1,
  height: 1,
  clip: 'rect(0, 0, 0, 0)',
  clipPath: 'inset(50%)',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
});

const DropBox = ({ allow, onDrop }: DropBoxProps) => {
  const [file, setFile] = useState<DropFile | null>(null);
  const inputFile = useRef<null | HTMLInputElement>(null);

  const { openAlert } = useAlert();

  useEffect(() => onDrop(file), [file]);

  const onInputFile = (e: ChangeEvent) => {
    const file = (e.target as HTMLInputElement & { files: FileList }).files[0];

    if (!file) return;

    inputFileReader(
      file,
      allow,
      (data) => {
        setFile({ ...data });
      },
      (message) => {
        openAlert({
          type: 'error',
          message,
        });
      }
    );
  };

  const onDropBox: DropBoxEvent = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      inputFileReader(
        e.dataTransfer.files[0],
        allow,
        (data) => {
          setFile({ ...data });
        },
        (message) => {
          openAlert({
            type: 'error',
            message,
          });
        }
      );
    },
    [allow]
  );

  const onDropBoxOver: DropBoxEvent = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDropBoxEnter: DropBoxEvent = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDropBoxLeave: DropBoxEvent = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <Stack className="drop-box">
      <Box
        onDrop={onDropBox}
        onDragOver={onDropBoxOver}
        onDragEnterCapture={onDropBoxEnter}
        onDragLeave={onDropBoxLeave}
      />
      <FileOpenOutlinedIcon fontSize="large" />
      <Typography>{`드래그 하여 ${allow
        .map((str) => str.toUpperCase())
        .join(',')}파일 업로드`}</Typography>
      <Button component="label" variant="contained">
        찾아보기
        <HiddenInput ref={inputFile} type="file" onChange={onInputFile} />
      </Button>
    </Stack>
  );
};

export default DropBox;
