import { Stack, IconButton, Typography } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import useModal from '~/hooks/useModal';
import useDialog from '~/hooks/useDialog';
import Contents from './Contents';
import { deleteApi } from '~/api';

const EditApiDialog = ({ title, path }: { title: string; path: string }) => {
  const { openModal } = useModal();
  const { openDialog } = useDialog();
  const { mutate } = deleteApi();

  const open = () => {
    openDialog({
      title: 'JSON',
      content: <Contents path={path} />,
      actions: [
        {
          text: '삭제',
          variant: 'contained',
          onAction: async (closeFn) => {
            const flag = await openModal({
              type: 'confirm',
              title: '알림',
              message: '삭제하시겠습니까?',
            });

            if (flag) {
              mutate({ path, callback: closeFn });
            }
          },
        },
        {
          text: '닫기',
          onAction: (closeFn) => closeFn(),
        },
      ],
    });
  };

  return (
    <IconButton onClick={open} disableRipple={true}>
      <Stack sx={{ alignItems: 'center' }}>
        <CodeIcon />
        <Typography sx={{ fontSize: '0.6rem' }}>
          {title ? title : 'Edit'}
        </Typography>
      </Stack>
    </IconButton>
  );
};

export default EditApiDialog;
