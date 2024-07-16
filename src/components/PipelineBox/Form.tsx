import { useState, useEffect, useContext } from 'react';
import { Box, Tab, ButtonGroup } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ApiContext } from '~/components/PipelineBox';
import Monaco from '~/features/Monaco';
import CopyButton from '~/features/CopyButton';
import UtilButton from '~/features/UtilButton';
import SwitchButton from '~/features/SwitchButton';
import useAlert from '~/hooks/useAlert';
import { patchApiPipeline } from '~/api';
import TestApiDialog from '~/dialog/TestApiDialog';
import type { ChangeEvent } from 'react';
import type { ApiData } from '~/api';
import type { editor } from 'monaco-editor';

const Form = () => {
  const { path, methods, pipeline } = useContext(ApiContext) as ApiData & {
    methods: string[];
  };
  const { openAlert } = useAlert();
  const [tabValue, setTabValue] = useState<string | null>(null);
  const [codes, setCodes] = useState(pipeline);
  const [validate, setValidate] = useState<
    Pick<editor.IMarker, 'code' | 'endColumn' | 'endLineNumber' | 'message'>[]
  >([]);

  const { mutate } = patchApiPipeline();

  useEffect(() => {
    if (path) {
      if (!tabValue) {
        setTabValue(
          ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'].find((method) =>
            methods.includes(method)
          ) ?? null
        );
      }
      setCodes(pipeline);
    }
  }, [methods, pipeline]);

  const onRefreshCode = (method: string) => {
    setCodes((prev) => ({ ...prev, [method]: pipeline[method] }));
  };

  const onChangeActive = (e: ChangeEvent<HTMLInputElement>, method: string) => {
    mutate({
      path,
      key: method,
      data: { ...codes[method], isActive: e.target.checked },
    });
  };

  const onValidateCode = (makers: editor.IMarker[]) => {
    setValidate(makers.filter((maker) => !!maker.code));
  };

  const onSaveCode = (method: string) => {
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

    mutate({ path, key: method, data: codes[method] });
  };

  return tabValue && methods?.length > 0 && codes ? (
    <Box className="form">
      <TabContext value={tabValue}>
        <TabList onChange={(_, value) => setTabValue(value)}>
          {['GET', 'POST', 'PATCH', 'PUT', 'DELETE'].map((method) => {
            if (methods.includes(method))
              return <Tab key={method} label={method} value={method} />;
            return null;
          })}
        </TabList>
        {methods.map((method) => (
          <TabPanel key={method} value={method}>
            {/* {codes[method] && ( */}
            <Monaco
              language="javascript"
              value={codes[method]?.value ?? ''}
              height="auto"
              onChange={(data) =>
                setCodes((prev) => ({
                  ...prev,
                  [method]: { ...prev[method], value: data },
                }))
              }
              onValidate={(makers) => onValidateCode(makers)}
            >
              <ButtonGroup variant="outlined" size="small">
                <SwitchButton
                  title="Active"
                  checked={pipeline[method].isActive}
                  onChange={(e) => onChangeActive(e, method)}
                />
                <CopyButton
                  title="Copy"
                  data={codes[method]?.value ?? ''}
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
                <TestApiDialog
                  path={path}
                  method={method}
                  disabled={!pipeline[method].isActive}
                />
                <UtilButton
                  title="Refresh"
                  icon={<RefreshIcon />}
                  disabled={pipeline[method].value === codes[method]?.value}
                  onClick={() => onRefreshCode(method)}
                />
                <UtilButton
                  title="Save"
                  icon={<SaveIcon />}
                  disabled={pipeline[method].value === codes[method]?.value}
                  onClick={() => onSaveCode(method)}
                />
              </ButtonGroup>
            </Monaco>
            {/* )} */}
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  ) : (
    <Box className="empty-box">활성화된 Method가 없습니다.</Box>
  );
};

export default Form;
