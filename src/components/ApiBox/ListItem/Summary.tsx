import { useRef, useState, useContext, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Chip,
  Stack,
  Box,
  Input,
  AccordionSummary,
  Button,
  ButtonGroup,
  IconButton,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import { ApiContext } from '~/components/ApiBox/ListItem';
import EditApiDialog from '~/dialog/EditApiDialog';
import CopyButton from '~/features/CopyButton';
import DownloadButton from '~/features/DownloadButton';
import useAlert from '~/hooks/useAlert';
import { highlightMarker } from '~/utils';
import { patchApiPath } from '~/api';

import { ApiData } from '~/types/components';

const Summary = ({ onToggleExpand }: { onToggleExpand: () => void }) => {
  const inputRef = useRef();
  const [searchParam] = useSearchParams();
  const { path, description, methods } = useContext(ApiContext) as ApiData;
  const [editable, setEditable] = useState(false);
  const { mutate } = patchApiPath();

  const { openAlert } = useAlert();

  const markSearchValue = useCallback(
    (str: string) => {
      if (searchParam.get('search')) {
        return highlightMarker(str, searchParam.get('search') ?? '');
      }
      return str;
    },
    [searchParam.get('search')]
  );

  const onChangePath = () => {
    if (inputRef?.current) {
      mutate({ path, data: (inputRef?.current as HTMLInputElement).value });
    }
  };

  const onCopiedClipboard = () => {
    openAlert({
      type: 'info',
      message: '클립보드에 복사 되었습니다.',
    });
  };

  return (
    <AccordionSummary
      expandIcon={
        <IconButton onClick={onToggleExpand}>
          <ExpandMoreIcon />
        </IconButton>
      }
    >
      <Stack className="path-stack">
        <Box>
          {Object.keys(methods).map((method) => (
            <Chip key={method} label={method} />
          ))}
          {description && (
            <Typography>{markSearchValue(description)}</Typography>
          )}
        </Box>
        <ButtonGroup size="medium">
          <CopyButton data={path} onSuccess={onCopiedClipboard} />

          {!editable ? (
            <Button variant="text" onClick={() => setEditable(true)}>
              {markSearchValue(path)}
            </Button>
          ) : (
            <Input
              className="edit-path"
              inputRef={inputRef}
              defaultValue={path}
              endAdornment={
                <>
                  <IconButton onClick={onChangePath}>
                    <CheckCircleIcon />
                  </IconButton>
                  <IconButton onClick={() => setEditable(false)}>
                    <CancelIcon />
                  </IconButton>
                </>
              }
            />
          )}
        </ButtonGroup>
      </Stack>
      <Stack className="ctrl-stack">
        <DownloadButton
          title="Down"
          url={`/api/v1/json/download?path=${path}`}
          fileName={`api${path.split('/').join('_')}`}
        />
        <EditApiDialog title="JSON" path={path} />
      </Stack>
    </AccordionSummary>
  );
};

export default Summary;
