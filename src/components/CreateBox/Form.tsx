import React, {
  ChangeEvent,
  ForwardedRef,
  forwardRef,
  useState,
  useCallback,
  useImperativeHandle,
} from 'react';
import {
  Stack,
  Box,
  FormGroup,
  FormLabel,
  FormControl,
  FormControlLabel,
  OutlinedInput,
  Checkbox,
} from '@mui/material';
import MapInput, { MapData } from '~/features/MapInput';
import Monaco from '~/features/Monaco';
import { deepClone, debounce } from '~/utils';
import useAlert from '~/hooks/useAlert';
import type { editor } from 'monaco-editor';
import type { ApiData } from '~/api';

export type RefType = {
  ref: ForwardedRef<EventRef>;
};
export type EventRef = {
  resetFormData: () => void;
  getFormData: () => ApiData | void;
};

const defaultForm = {
  path: '',
  headers: [],
  description: '',
  methods: {},
  pipeline: {},
};

const Form = (_: null, ref: RefType) => {
  const [formData, setFormData] =
    useState<Omit<ApiData, 'response'>>(defaultForm);
  const [response, setResponse] = useState<string>('[]');
  const [validate, setValidate] = useState<editor.IMarker[] | []>();
  const { openAlert } = useAlert();

  useImperativeHandle(
    ref,
    () => ({
      resetFormData: () => {
        setFormData(deepClone(defaultForm));
        setResponse('[]');
      },
      getFormData: () => {
        if (!validate?.length) {
          return {
            ...formData,
            response: response ? JSON.parse(response) : '',
          };
        }

        openAlert({
          type: 'error',
          message: validate
            .map(
              ({ endLineNumber, endColumn, message }) =>
                `등록에 실패했습니다.\n${endLineNumber}:${endColumn} ${message}`
            )
            .join('\n'),
        });
      },
    }),
    [formData, response, validate]
  );

  const onChangePath = (e: ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, path: e.target.value }));

  const onChangeDescription = (e: ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, description: e.target.value }));

  const onChangeHeader = useCallback(
    debounce(
      (headers: MapData[]) => setFormData((prev) => ({ ...prev, headers })),
      500
    ),
    []
  );

  const onChangeMethod = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, labels } = e.target;

    if (!labels) return;
    setFormData((prev) => {
      if (checked) {
        return {
          ...prev,
          methods: {
            ...prev.methods,
            [labels[0].innerText]: { delay: 0, status: 200 },
          },
        };
      }

      delete prev.methods[labels[0].innerText];
      return { ...prev };
    });
  };

  const onValidateCode = (makers: editor.IMarker[]) => {
    setValidate(makers.filter((maker) => !!maker.code));
  };

  return (
    <Box className="form-box">
      <FormGroup>
        <FormLabel
          required
          sx={{ '& .MuiFormLabel-asterisk': { color: 'red' } }}
        >
          Path
        </FormLabel>
        <OutlinedInput
          type="text"
          value={formData.path}
          onChange={onChangePath}
        />
      </FormGroup>
      <FormGroup>
        <FormLabel>Description</FormLabel>
        <OutlinedInput
          type="text"
          value={formData.description}
          onChange={onChangeDescription}
          multiline={true}
          minRows={2}
        />
      </FormGroup>
      <FormGroup>
        <FormLabel>Headers</FormLabel>
        <Box>
          <MapInput datas={formData.headers} onChange={onChangeHeader} />
        </Box>
      </FormGroup>
      <FormGroup>
        <FormLabel>Methods</FormLabel>
        <Stack direction="row" sx={{ flexWrap: 'wrap' }}>
          {['GET', 'POST', 'PATCH', 'PUT', 'DELETE'].map((method) => (
            <FormControl key={method} size="small">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      Object.keys(formData.methods)?.indexOf(method) > -1
                    }
                    onChange={onChangeMethod}
                  />
                }
                label={method}
              />
            </FormControl>
          ))}
        </Stack>
      </FormGroup>
      <FormGroup>
        <FormLabel>Response</FormLabel>
        <Monaco
          value={response}
          height={260}
          onChange={setResponse}
          onValidate={onValidateCode}
        />
      </FormGroup>
    </Box>
  );
};

export default forwardRef(Form);
