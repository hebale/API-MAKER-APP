import { useState } from 'react';
import { Stack, Box, Button, Chip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export type LogProps = {
  ip: string;
  path: string;
  method: string;
  query: string;
  body: any;
  response: any;
  timeStamp: string;
};

const Log = ({ data }: { data: LogProps }) => {
  const [open, setOpen] = useState(false);
  const { path, method, query, body, response, timeStamp } = data;

  return (
    <Box>
      <Stack>
        <Chip label={method} />
        <Typography>{`${path}${query ? '?' + query : ''}`}</Typography>
        <Typography>{timeStamp.split(' ')[1]}</Typography>
        <Button onClick={() => setOpen((prev) => !prev)}>
          {open ? <RemoveIcon /> : <AddIcon />}
        </Button>
      </Stack>
      {open && (
        <Stack>
          <dl>
            <dt>request</dt>
            <dd>{body ? JSON.stringify(body, null, 2) : '-'}</dd>
            <dt>response</dt>
            <dd>{response ? JSON.stringify(response, null, 2) : '-'}</dd>
          </dl>
        </Stack>
      )}
    </Box>
  );
};

export default Log;
