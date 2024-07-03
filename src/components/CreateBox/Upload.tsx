import {
  useState,
  useEffect,
  useRef,
  useContext,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  Stack,
  Box,
  Button,
  FormGroup,
  FormControl,
  Typography,
  Chip,
  Tooltip,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import Monaco from '~/features/Monaco';
import DropBox from '~/features/DropBox';

import schemas from '~/schema';
import { DialogContentContext } from '~/features/Dialogs';
import useAlert from '~/hooks/useAlert';

import type { RefType } from './Form';
import type { editor } from 'monaco-editor';
import type { DropFile } from '~/types/features';

const schemaInfo = `
  path: string
  description: string
  header: {
    uuid: string
    isActive: boolean
    key: string
    value: string
  }
  methods: {
    [key: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' ]: {
      delay: number
      status: 200 | 304 | 400 | 401 | 403 | 405 | 408 | 500 | 501 | 505
    }
  }
  pipeline: {
    [key: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' ]: {
      isActive: boolean
      code: string
    }
  }
  response: any
  createdDate?: string
  updatedDate?: string
`;

const UploadForm = (_: null, ref: RefType) => {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState<string>('');
  const [uploadData, setUploadData] = useState<DropFile | null>(null);
  const [markers, setMarkers] = useState<editor.IMarker[] | []>();
  const inputFile = useRef<null | HTMLInputElement>(null);
  const setDatas = useContext(DialogContentContext);
  const { openAlert } = useAlert();

  useEffect(() => {
    setDatas && setDatas(code || uploadData?.data);
  }, [code, uploadData]);

  useImperativeHandle(
    ref,
    () => ({
      resetFormData: () => {
        setUploadData('');
      },
      getFormData: () => {
        if (!markers?.length) {
          return JSON.parse(code);
        }

        openAlert({
          type: 'error',
          message: markers
            .map(
              ({ endLineNumber, endColumn, message }) =>
                `등록에 실패했습니다.\n${endLineNumber}:${endColumn} ${message}`
            )
            .join('\n'),
        });
      },
    }),
    [code, uploadData, markers]
  );

  const onInputFileClear = () => {
    setUploadData(null);
    (inputFile.current as HTMLInputElement).value = '';
  };

  return (
    <Box className="upload-box">
      <Stack>
        <Tooltip
          PopperProps={{
            className: 'schema-tooltip',
          }}
          open={open}
          title={schemaInfo}
          arrow={true}
          placement="left-start"
        >
          <Button variant="text" onClick={() => setOpen((prev) => !prev)}>
            <InfoOutlinedIcon />
            Schema
          </Button>
        </Tooltip>
        {uploadData && (
          <Chip
            label={
              <Stack flexDirection="row" alignItems="center">
                {uploadData.name}
                <Typography>({uploadData.size}byte)</Typography>
              </Stack>
            }
            onDelete={onInputFileClear}
          />
        )}
      </Stack>
      <FormGroup>
        <FormControl size="small">
          {uploadData ? (
            <Monaco
              value={uploadData.data as string}
              height={800}
              schemas={schemas}
              onChange={(data) => data && setCode(data)}
              onValidate={setMarkers}
            />
          ) : (
            <DropBox allow={['json']} onDrop={(data) => setUploadData(data)} />
          )}
        </FormControl>
      </FormGroup>
    </Box>
  );
};

export default forwardRef(UploadForm);
