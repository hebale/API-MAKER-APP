import { useContext } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { LogContext, LogDispatchContext } from '~/contexts/LogContext';
import UtilButton from '~/features/UtilButton';
import Log from './Log';

const LogBox = () => {
  const logs = useContext(LogContext);
  const { clear } = useContext(LogDispatchContext);

  return (
    <Box className="api-log">
      <Stack>
        <Typography>API 로그</Typography>
        <UtilButton
          title="Clear"
          icon={<DeleteOutlineIcon />}
          onClick={clear}
        />
      </Stack>

      {logs.length > 0 ? (
        logs.map((log, index) => <Log key={index} data={log} />)
      ) : (
        <Box className="empty-box">로그가 없습니다.</Box>
      )}
    </Box>
  );
};

export default LogBox;
