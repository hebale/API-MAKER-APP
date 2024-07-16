import { useState, useEffect, useContext } from 'react';
import { Box, ButtonGroup } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ApiContext } from '~/components/ApiBox/ListItem';
import Monaco from '~/features/Monaco';
import CopyButton from '~/features/CopyButton';
import UtilButton from '~/features/UtilButton';
import useAlert from '~/hooks/useAlert';
import { patchApiResponse } from '~/api';
import type { ApiData } from '~/types/components';
import type { editor } from 'monaco-editor';

const Response = () => {
  const { path, response } = useContext(ApiContext) as ApiData;
  const [code, setCode] = useState<string>(JSON.stringify(response, null, 2));
  const [isChanged, setIsChanged] = useState(false);
  const [validate, setValidate] = useState<
    Pick<editor.IMarker, 'endColumn' | 'endLineNumber' | 'message'>[]
  >([]);

  const { mutate } = patchApiResponse();
  const { openAlert } = useAlert();

  useEffect(() => {
    setIsChanged(JSON.stringify(response, null, 2) === code);
  }, [code]);

  useEffect(() => {
    if (typeof response !== 'string') onRefreshCode();
  }, [response]);

  const onRefreshCode = () => setCode(JSON.stringify(response, null, 2));

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

    mutate({ path, data: code });
  };

  const onValidateCode = (makers: editor.IMarker[]) => {
    setValidate(makers.filter((maker) => !!maker.code));
  };

  return (
    <Box className="api-response">
      <Monaco
        value={code}
        height="auto"
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
          <UtilButton
            title="Refresh"
            icon={<RefreshIcon />}
            disabled={isChanged}
            onClick={onRefreshCode}
          />
          <UtilButton
            title="Save"
            icon={<SaveIcon />}
            disabled={isChanged}
            onClick={onSaveCode}
          />
        </ButtonGroup>
      </Monaco>
    </Box>
  );
};

export default Response;
