import { useContext } from 'react';
import { Box, Alert, Collapse } from '@mui/material';
import { TransitionGroup } from 'react-transition-group';
import {
  AlertStatusContext,
  AlertDispatchContext,
} from '~/contexts/AlertContext';
import type { AlertProps } from '~/types/features';

const Alerts = () => {
  const alerts = useContext(AlertStatusContext);
  const { close } = useContext(AlertDispatchContext);

  return (
    <Box className="alert-box">
      <TransitionGroup>
        {alerts.map((alert: AlertProps) => {
          const { id = new Date().getTime(), type, message, timer } = alert;

          setTimeout(() => {
            close(id);
          }, timer ?? 3500);

          return (
            <Collapse key={id}>
              <Alert severity={type ?? 'info'} onClose={() => close(id)}>
                {message}
              </Alert>
            </Collapse>
          );
        })}
      </TransitionGroup>
    </Box>
  );
};

export default Alerts;
