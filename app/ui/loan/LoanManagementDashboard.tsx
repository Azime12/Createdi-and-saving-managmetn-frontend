'use client';

import React, { useState } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import LoanApplicationsTab from './tabs/LoanApplicationsTab';
import ActiveLoansTab from './tabs/ActiveLoansTab';
// import LoanStatsTab from './tabs/LoanStatsTab';
import LoanPaymentsTab from './tabs/LoanPaymentsTab';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}


function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`loan-management-tabpanel-${index}`}
      aria-labelledby={`loan-management-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `loan-management-tab-${index}`,
    'aria-controls': `loan-management-tabpanel-${index}`,
  };
}

const LoanManagementDashboard = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Loan Management Dashboard
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="loan management tabs">
          <Tab label="Applications" {...a11yProps(0)} />
          <Tab label="Active Loans" {...a11yProps(1)} />
          <Tab label="Payments" {...a11yProps(2)} />
          {/* <Tab label="Stati stics" {...a11yProps(4)} /> */}
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <LoanApplicationsTab />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ActiveLoansTab />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <LoanPaymentsTab />
      </TabPanel>
      <TabPanel value={value} index={4}>
        {/* <LoanStatsTab /> */}
      </TabPanel>
    </Box>
  );
};

export default LoanManagementDashboard;
