import { useRef } from 'react';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import useDialog from '~/hooks/useDialog';
import UtilButton from '~/features/UtilButton';
import Contents from './Contents';
import type { RefType, EventRef } from './Contents';

const TestApiDialog = ({
  path,
  method,
  disabled = false,
}: {
  path: string;
  method: string;
  disabled?: boolean;
}) => {
  const { openDialog } = useDialog();
  const eventRef = useRef<EventRef>();

  const open = () => {
    openDialog({
      title: 'API 테스트',
      content: <Contents path={path} method={method} ref={eventRef} />,
      actions: [
        {
          text: '테스트',
          variant: 'contained',
          onAction: () => eventRef.current?.onTest(),
        },
        {
          text: '닫기',
          onAction: (closeFn) => closeFn(),
        },
      ],
      props: {
        maxWidth: false,
        fullWidth: true,
      },
    });
  };

  return (
    <UtilButton
      title="Test"
      icon={<PlayCircleOutlineIcon />}
      onClick={open}
      disabled={disabled}
    />
  );
};

export default TestApiDialog;
