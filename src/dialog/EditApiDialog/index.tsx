import CodeIcon from '@mui/icons-material/Code';
import useModal from '~/hooks/useModal';
import useDialog from '~/hooks/useDialog';
import UtilButton from '~/features/UtilButton';
import Contents from './Contents';
import { deleteApi } from '~/api';

const EditApiDialog = ({ path }: { path: string }) => {
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

  return <UtilButton title="JSON" icon={<CodeIcon />} onClick={open} />;
};

export default EditApiDialog;
