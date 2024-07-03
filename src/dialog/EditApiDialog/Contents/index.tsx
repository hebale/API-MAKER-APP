import { useState, useEffect } from 'react';
import { Box, ButtonGroup } from '@mui/material';
import Monaco from '~/features/Monaco';
import CopyButton from '~/features/CopyButton';
import SaveButton from '~/features/SaveButton';
import RefreshButton from '~/features/RefreshButton';
import { getApi, putApi } from '~/api';
import schemas from '~/schema';
import useAlert from '~/hooks/useAlert';
import type { editor } from 'monaco-editor';

const Contents = ({ path }: { path: string }) => {
  const { data } = getApi(path);
  const { mutate } = putApi();
  const [code, setCode] = useState(JSON.stringify(data, null, 2));
  const [isChanged, setIsChanged] = useState(false);
  const { openAlert } = useAlert();
  const [validate, setValidate] = useState<
    Pick<editor.IMarker, 'endColumn' | 'endLineNumber' | 'message'>[]
  >([]);

  useEffect(() => setIsChanged(JSON.stringify(data, null, 2) === code), [code]);

  useEffect(() => {
    if (typeof data !== 'string') onRefreshCode();
  }, [data]);

  const onRefreshCode = () => setCode(JSON.stringify(data, null, 2));

  const onSaveCode = async () => {
    if (validate.length) {
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

    mutate({
      path,
      data: JSON.parse(code),
      callback: () => {
        // console.log('callback edit JSON');
      },
    });
  };

  const onValidateCode = (makers: editor.IMarker[]) => {
    setValidate(makers);
  };

  return (
    <Box className="json-dialog">
      <Monaco
        // id
        value={code}
        height={700}
        schemas={schemas}
        onChange={(data) => setCode(data ?? '')}
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
          <RefreshButton
            title="Refresh"
            disabled={isChanged}
            onClick={onRefreshCode}
          />
          <SaveButton title="Save" disabled={isChanged} onClick={onSaveCode} />
        </ButtonGroup>
      </Monaco>
    </Box>
  );
};

export default Contents;
