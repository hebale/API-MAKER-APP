import { useContext } from 'react';
import { Box, Typography } from '@mui/material';
import { LogContext } from '~/contexts/LogContext';
import Log from './Log';

const LogBox = () => {
  const logs = useContext(LogContext);

  return (
    <Box className="log-box">
      <Typography>API 로그</Typography>

      {logs.length > 0 ? (
        logs.map((log, index) => <Log key={index} data={log} />)
      ) : (
        <Box className="empty-box">로그가 없습니다.</Box>
      )}
    </Box>
  );
};

export default LogBox;
