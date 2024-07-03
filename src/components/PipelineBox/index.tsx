import React, { useState, useEffect } from 'react';
import {
  Paper,
  FormGroup,
  FormLabel,
  FormControl,
  Select,
  Checkbox,
  IconButton,
  Typography,
} from '@mui/material';

import Form from './Form';
import Result from './Result';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';

const value = {
  'is TEST': [
    123,
    3124,
    342523,
    {
      'good-job': true,
    },
  ],
};

const PipelineBox = () => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState('Default Result');

  useEffect(() => {
    setResult(JSON.stringify(value, null, 2));
  }, []);

  return (
    <Paper elevation={2} sx={{ p: 1 }}>
      <Typography variant="subtitle1" component="p">
        PIPELINE
      </Typography>
      <Form />

      <KeyboardDoubleArrowDownIcon />
      <Result data={result} />
    </Paper>
  );
};

export default PipelineBox;
