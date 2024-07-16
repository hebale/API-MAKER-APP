import {
  useState,
  useEffect,
  useContext,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  Stack,
  FormGroup,
  FormLabel,
  OutlinedInput,
  ButtonGroup,
  Typography,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import EastIcon from '@mui/icons-material/East';
import MapInput from '~/features/MapInput';
import Monaco from '~/features/Monaco';
import Viewer from '~/features/Viewer';
import CopyButton from '~/features/CopyButton';
import UtilButton from '~/features/UtilButton';
import { DialogContentContext } from '~/features/Dialogs';
import useAlert from '~/hooks/useAlert';
import { getApi, patchApiPipeline, postTestPipeline } from '~/api';
import type { editor } from 'monaco-editor';
import type { MapData } from '~/features/MapInput';
import type { ApiData } from '~/api';
import type { ForwardedRef } from 'react';

export type RefType = {
  ref: ForwardedRef<EventRef>;
};

export type EventRef = {
  onTest: () => void;
};

export type RequestType = {
  query: string;
  body: any;
};

export type ContentsProps = {
  path: string;
  method: string;
};

const Contents = ({ path, method }: ContentsProps, ref: RefType) => {
  const { data } = getApi(path) as { data: ApiData };
  const { mutate: pathPipelineMutate } = patchApiPipeline();
  const { mutate: postPipelineMutate } = postTestPipeline();
  const { openAlert } = useAlert();
  const setContents = useContext(DialogContentContext);
  const [query, setQuery] = useState('');
  const [body, setBody] = useState<{ [key: string]: string }>();
  const [code, setCode] = useState(data.pipeline[method].value);
  const [validate, setValidate] = useState<
    Pick<editor.IMarker, 'code' | 'endColumn' | 'endLineNumber' | 'message'>[]
  >([]);

  const [testResult, setTestResult] = useState();

  useEffect(() => {
    setContents && setContents({ query, body });
  }, [query, body]);

  useImperativeHandle(
    ref,
    () => ({
      onTest: () => {
        postPipelineMutate(
          { path, method, query, body },
          {
            onSuccess: (data) => {
              setTestResult(data);
            },
          }
        );
      },
    }),
    [query, body, code]
  );

  const onChangeBody = (data: MapData[]) => {
    setBody(
      data.reduce((acc: { [key: string]: string }, map: MapData) => {
        if (!!map.key) acc[map.key] = map.value;
        return acc;
      }, {})
    );
  };

  const onRefreshCode = () => setCode(data.pipeline[method].value);

  const onValidateCode = (makers: editor.IMarker[]) => {
    setValidate(makers.filter((maker) => !!maker.code));
  };

  const onSaveCode = (code: string) => {
    if (validate.filter(({ code }) => code !== '6133').length) {
      return openAlert({
        type: 'error',
        message: `JSON 양식을 확인해주세요.\n${validate
          .map(
            ({ endLineNumber, endColumn, message }) =>
              `${endLineNumber}:${endColumn} ${message}`
          )
          .join(`\n`)}`,
        timer: 5000,
      });
    }

    pathPipelineMutate({
      path,
      key: method,
      data: { ...data.pipeline[method], value: code },
    });
  };

  const onTest = () => {
    postPipelineMutate(
      { path, method, query, body },
      {
        onSuccess: (data) => {
          setTestResult(data);
        },
      }
    );
  };

  return (
    <Stack className="test-dialog">
      <Stack className="parameter">
        <FormGroup>
          <FormLabel>Url</FormLabel>
          <OutlinedInput
            startAdornment={<Typography>{`${path}?`}</Typography>}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Method</FormLabel>
          <OutlinedInput type="text" value={method} readOnly={true} />
        </FormGroup>
        <FormGroup>
          <FormLabel>Body</FormLabel>
          <MapInput useCheck={false} onChange={onChangeBody} />
        </FormGroup>
        <FormGroup>
          <FormLabel>Data</FormLabel>
          <Viewer
            maxHeight={420}
            value={JSON.stringify(data.response, null, 2)}
          />
        </FormGroup>
      </Stack>
      <EastIcon />
      <Stack className="pipeline">
        <Monaco
          language="javascript"
          value={code}
          height="auto"
          onChange={(data) => setCode(data)}
          onValidate={(makers) => onValidateCode(makers)}
        >
          <ButtonGroup variant="outlined" size="small">
            <CopyButton
              title="Copy"
              data={code}
              onSuccess={() =>
                openAlert({
                  type: 'info',
                  message: '클립보드에 복사 되었습니다.',
                })
              }
              onError={(msg) =>
                openAlert({
                  type: 'error',
                  message: `${msg}\n복사 중 오류가 발생했습니다. 다시 시도해 주세요.`,
                })
              }
            />
            <UtilButton
              title="Refresh"
              icon={<RefreshIcon />}
              disabled={data.pipeline[method].value === code}
              onClick={() => onRefreshCode()}
            />
            <UtilButton
              title="Save"
              icon={<SaveIcon />}
              disabled={data.pipeline[method].value === code}
              onClick={() => onSaveCode(code)}
            />
          </ButtonGroup>
        </Monaco>
      </Stack>
      <EastIcon />
      {testResult ? (
        <Stack className="result">
          <FormGroup>
            <FormLabel>Response</FormLabel>
            <Viewer
              maxHeight={method === 'GET' ? 630 : 300}
              value={JSON.stringify(testResult?.result, null, 2)}
            />
          </FormGroup>
          {method !== 'GET' && (
            <FormGroup>
              <FormLabel>Data</FormLabel>
              <Viewer
                maxHeight={300}
                value={JSON.stringify(testResult?.response, null, 2)}
              />
            </FormGroup>
          )}
        </Stack>
      ) : (
        <Stack className="empty-box">테스트 결과가 없습니다.</Stack>
      )}
    </Stack>
  );
};

export default forwardRef(Contents);
