import { useContext, useState } from 'react';
import {
  Stack,
  Box,
  Modal,
  OutlinedInput,
  Button,
  Typography,
} from '@mui/material';
import {
  ModalStatusContext,
  ModalDispatchContext,
} from '~/contexts/ModalContext';
import type { ModalProps } from '~/types/features';

const Modals = () => {
  const modals = useContext(ModalStatusContext);
  const { close } = useContext(ModalDispatchContext);
  const [input, setInput] = useState<string | null>(null);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    p: 3,
    transform: 'translate(-50%, -50%)',
    width: 400,
    borderRadius: '4px',
    backgroundColor: '#fff',
    boxShadow: 24,
  };

  return (
    <>
      {modals.map((modal: ModalProps) => {
        const { id, type, title, message, resolve } = modal;

        return (
          <Modal
            key={id}
            open={true}
            sx={{ zIndex: 1600 }}
            onClose={() => close(id as number)}
          >
            <Box sx={style}>
              <Typography variant="h6" component="h2">
                {title}
              </Typography>
              <Typography sx={{ mt: 2 }}>{message}</Typography>

              {type === 'prompt' && (
                <OutlinedInput
                  type="contained"
                  size="small"
                  sx={{ mt: 2, width: '100%' }}
                  onChange={(e) => setInput(e.target.value)}
                />
              )}

              <Stack
                spacing={1}
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                sx={{ mt: 2 }}
              >
                {type === 'alert' ? (
                  <Button
                    variant="contained"
                    onClick={() => {
                      close(id as number);
                      resolve(true);
                    }}
                  >
                    확인
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      onClick={() => {
                        close(id as number);
                        resolve(type === 'prompt' ? input : true);
                      }}
                    >
                      확인
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        close(id as number);
                        resolve(false);
                      }}
                    >
                      취소
                    </Button>
                  </>
                )}
              </Stack>
            </Box>
          </Modal>
        );
      })}
    </>
  );
};

export default Modals;
