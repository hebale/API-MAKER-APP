import React, { useContext, useState, createContext } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  DialogStatusContext,
  DialogDispatchContext,
} from '~/contexts/DialogContext';
import type { ActionProps } from '~/types/features';

export const DialogContentContext = createContext<React.Dispatch<any> | null>(
  null
);

const Dialogs = () => {
  const dialogs = useContext(DialogStatusContext);
  const { close } = useContext(DialogDispatchContext);
  const [contents, setContents] = useState<any>();

  return (
    <>
      {dialogs.map((dialog) => {
        const {
          id = new Date().getTime(),
          open,
          title,
          content,
          actions = [],
          props,
        } = dialog;

        const onCloseDialog: () => void = () => close(id);

        return (
          <Dialog
            key={id}
            open={open as boolean}
            fullWidth={true}
            maxWidth={'lg'}
            onClose={() => onCloseDialog()}
            {...props}
          >
            <DialogTitle>{title}</DialogTitle>
            <IconButton
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
              }}
              onClick={() => onCloseDialog()}
            >
              <CloseIcon />
            </IconButton>
            <DialogContent>
              <DialogContentContext.Provider value={setContents}>
                {content}
              </DialogContentContext.Provider>
            </DialogContent>
            {!!actions.length && (
              <DialogActions sx={{ py: 2 }}>
                {actions.map((action, index) => {
                  const { text, onAction, ...rest }: ActionProps = action;

                  return (
                    <Button
                      key={`${text}_${index}`}
                      onClick={() => onAction(onCloseDialog, contents)}
                      {...rest}
                    >
                      {text}
                    </Button>
                  );
                })}
              </DialogActions>
            )}
          </Dialog>
        );
      })}
    </>
  );
};

export default Dialogs;
