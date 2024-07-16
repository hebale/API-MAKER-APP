import { useRef, useState } from 'react';
import { Box, Stack, Button, Tab, Typography } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import RefreshIcon from '@mui/icons-material/Refresh';
import UtilButton from '~/features/UtilButton';
import useAlert from '~/hooks/useAlert';
import Form from './Form';
import Upload from './Upload';
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
    <Box className="api-create">
      <Stack>
        <Typography>API 생성</Typography>
        <UtilButton
          title="Reset"
          icon={<RefreshIcon />}
          onClick={onRefreshForm}
        />
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
