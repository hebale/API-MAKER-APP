import { useRef, useState } from 'react';
import { Box, Stack, Button, Tab, Typography } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import RefreshButton from '~/features/RefreshButton';
import Form from './Form';
import Upload from './Upload';
import useAlert from '~/hooks/useAlert';
import { getApiList, postApi } from '~/api';
import type { EventRef, RefType } from './Form';

const tabConfig = [
  {
    label: 'input',
    component: (ref: RefType) => ref && <Form {...{ ref }} />,
  },
  {
    label: 'upload',
    component: (ref: RefType) => ref && <Upload {...{ ref }} />,
  },
];

const CreateBox = () => {
  const eventRef = useRef<EventRef>();
  const [tabValue, setTabValue] = useState('input');
  const { openAlert } = useAlert();
  const { mutate: createApi } = postApi();
  const { data: pathLists } = getApiList();
  const onRefreshForm = () => eventRef.current?.resetFormData();

  const onCreateApi = () => {
    const formData = eventRef.current?.getFormData();
    if (!formData) return;
    if (!formData.path) {
      openAlert({
        type: 'error',
        message: 'path를 입력해주세요.',
      });
    } else if (pathLists && pathLists?.indexOf(formData.path) > -1) {
      openAlert({
        type: 'error',
        message: '중복된 API가 존재합니다.',
      });
    } else {
      createApi({ data: formData });
      eventRef.current?.resetFormData();
    }
  };

  return (
    <Box className="create-box">
      <Stack>
        <Typography>API 생성</Typography>
        <RefreshButton title="Reset" onClick={onRefreshForm} />
        <Button variant="contained" onClick={onCreateApi}>
          등록
        </Button>
      </Stack>
      <TabContext value={tabValue}>
        <TabList onChange={(e, value) => setTabValue(value)}>
          {tabConfig.map(({ label }) => (
            <Tab key={label} label={label} value={label} />
          ))}
        </TabList>
        {tabConfig.map(({ label, component }) => (
          <TabPanel key={label} value={label}>
            {component(eventRef)}
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
};

export default CreateBox;
