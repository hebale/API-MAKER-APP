import React, { useState } from 'react';
import { AccordionDetails, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import Headers from './Headers';
import Methods from './Methods';
import Response from './Response';

const tabConfig = [
  {
    label: 'headers',
    component: <Headers />,
  },
  {
    label: 'methods',
    component: <Methods />,
  },
  {
    label: 'response',
    component: <Response />,
  },
];

const Details = () => {
  const [tabValue, setTabValue] = useState('methods');

  return (
    <AccordionDetails>
      <TabContext value={tabValue}>
        <TabList onChange={(e, value) => setTabValue(value)}>
          {tabConfig.map(({ label }) => (
            <Tab key={label} label={label} value={label} />
          ))}
        </TabList>
        {tabConfig.map(({ label, component }) => (
          <TabPanel key={label} value={label}>
            {component}
          </TabPanel>
        ))}
      </TabContext>
    </AccordionDetails>
  );
};

export default Details;
