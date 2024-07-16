import { useContext } from 'react';
import { Box, Alert, Slide, Fade } from '@mui/material';
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
          const { id = performance.now(), type, message, timer } = alert;

          setTimeout(() => {
            close(id);
          }, timer ?? 3500);

          return (
            <Slide key={id} className="slide" direction="left" timeout={220}>
              <div>
                <Fade in={true}>
                  <Alert severity={type ?? 'info'} onClose={() => close(id)}>
                    {message}
                  </Alert>
                </Fade>
              </div>
            </Slide>
          );
        })}
      </TransitionGroup>
    </Box>
  );
};

export default Alerts;
