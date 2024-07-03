import type {
  TooltipProps,
  ButtonProps,
  DialogProps as MuiDialogProps,
} from '@mui/material';

export type DownloadFileProps = {
  url: string;
  fileName?: string;
};

/**
 * JSON data
 */
export type JSONData = {
  path: string;
  description?: string | number;
  headers: Header[];
  methods:
    | {
        [key in 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE']: {
          delay: number;
          status: number;
          callback: {
            isActive: boolean;
            code: string | null;
          };
        };
      }
    | {};
  response: any;
};

export type Header = {
  uuid: string;
  isActive: boolean;
  key: string;
  value: string;
};

/**
 * Dialog type
 */
export type DialogProps = {
  id?: number;
  open?: boolean;
  title: string;
  content: JSX.Element;
  actions?: ActionProps[];
  props?: Partial<MuiDialogProps>;
};

export type ActionProps = ButtonProps & {
  text: string;
  onAction: (cb: () => void, datas: any) => void;
};

export type DialogDispatchAction = {
  open: (dialog: DialogProps) => void;
  close: (id: number) => void;
};

/**
 * Alert type
 */
export type AlertProps = {
  id?: number;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  timer?: number;
};

export type AlertDispatchProps = {
  open: (alert: AlertProps) => void;
  close: (id: number) => void;
};

/**
 * Modal type
 */
export type ModalProps = {
  id?: number;
  type: 'alert' | 'confirm' | 'prompt';
  title?: string;
  message: string;
  resolve?: any;
};

export type ModalDispatchProps = {
  open: (alert: ModalProps) => Promise<ModalProps>;
  close: (id: number) => void;
};

/**
 * DropBox type
 */
export type DropBoxEvent = (e: React.DragEvent<HTMLDivElement>) => void;

export type DropFile = {
  name: string;
  size: number;
  data: string | ArrayBuffer | null;
};

export type DropBoxProps = {
  allow: string[];
  onDrop: (file: DropFile | null) => void;
};

/**
 * Function buttons
 */
export type DownloadButtonProps = {
  title?: string;
  url: string;
  fileName?: string;
};

export type CopyButtonProps = {
  title?: string;
  data: string;
  disabled?: boolean;
  onSuccess?: () => void;
  onError?: (msg: string) => void;
};

export type SaveButtonProps = {
  title?: string;
  disabled?: boolean;
  onClick: () => void;
};

export type RefreshButtonProps = {
  title?: string;
  disabled?: boolean;
  onClick: () => void;
};
