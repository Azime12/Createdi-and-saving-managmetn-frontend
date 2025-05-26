'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Divider,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Paper,
  Chip,
  Alert,
  IconButton,
  Stack,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useGetLoanByNumberQuery } from '@/redux/api/loanApiSlice';
import { AttachMoney, AccountBalance, Payment, Receipt, ArrowBack, CheckCircle, Search } from '@mui/icons-material';
import { format } from 'date-fns';

const PaymentForm = ({ loanNumber: initialLoanNumber, onSubmit, isLoading, onCancel }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [loanNumber, setLoanNumber] = useState(initialLoanNumber || '');
  const [isSearching, setIsSearching] = useState(false);

  const { data: loanData, isLoading: isLoanLoading, error: loanError } = useGetLoanByNumberQuery(loanNumber, {
    skip: !loanNumber
  });

  const loan = loanData?.data;

  const [paymentData, setPaymentData] = useState({
    loanId: '',
    amount: '',
    principalAmount: '',
    interestAmount: '',
    paymentDate: new Date(),
    method: 'bank_transfer',
    reference: '',
    notes: ''
  });

  const paymentMethods = [
    { value: 'bank_transfer', label: 'Bank Transfer', icon: <AccountBalance /> },
    { value: 'cash', label: 'Cash', icon: <AttachMoney /> },
    { value: 'mobile_money', label: 'Mobile Money', icon: <Payment /> },
    { value: 'check', label: 'Check', icon: <Receipt /> },
    { value: 'other', label: 'Other', icon: <Payment /> }
  ];

  useEffect(() => {
    if (loan) {
      setPaymentData(prev => ({
        ...prev,
        loanId: loan.id,
        principalAmount: '',
        interestAmount: ''
      }));
    }
  }, [loan]);

  useEffect(() => {
    if (loan && paymentData.amount) {
      const amount = parseFloat(paymentData.amount) || 0;
      const principal = Math.min(loan.balance, amount);
      const interest = Math.max(0, amount - principal);
      
      setPaymentData(prev => ({
        ...prev,
        principalAmount: principal.toFixed(2),
        interestAmount: interest.toFixed(2)
      }));
    }
  }, [paymentData.amount, loan]);

  const validateLoanNumber = () => {
    if (!loanNumber || loanNumber.trim() === '') {
      setErrors(prev => ({ ...prev, loanNumber: 'Loan number is required' }));
      return false;
    }
    return true;
  };

  const handleSearchLoan = () => {
    if (!validateLoanNumber()) return;
    setIsSearching(true);
  };

  const validateStep = () => {
    const newErrors = {};
    
    if (activeStep === 0) {
      // Loan validation
      if (!loan) {
        newErrors.loanNumber = 'Please find a valid loan first';
      }
      
      // Amount validation
      if (!paymentData.amount || paymentData.amount.trim() === '') {
        newErrors.amount = 'Amount is required';
      } else if (isNaN(parseFloat(paymentData.amount)) || parseFloat(paymentData.amount) <= 0) {
        newErrors.amount = 'Please enter a valid positive amount';
      } else if (loan && parseFloat(paymentData.amount) > loan.balance * 2) {
        newErrors.amount = 'Amount seems unusually high for this loan';
      }
      
      // Payment date validation
      if (!paymentData.paymentDate) {
        newErrors.paymentDate = 'Payment date is required';
      } else if (paymentData.paymentDate > new Date()) {
        newErrors.paymentDate = 'Future date is not allowed';
      }
      
      // Payment method validation
      if (!paymentData.method || paymentData.method.trim() === '') {
        newErrors.method = 'Payment method is required';
      }
      
      // Reference validation
      if (!paymentData.reference || paymentData.reference.trim() === '') {
        newErrors.reference = 'Reference number is required';
      } else if (paymentData.reference.length < 3) {
        newErrors.reference = 'Reference number is too short';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      onSubmit({
        ...paymentData,
        paymentDate: paymentData.paymentDate.toISOString(),
        amount: parseFloat(paymentData.amount),
        principalAmount: parseFloat(paymentData.principalAmount),
        interestAmount: parseFloat(paymentData.interestAmount)
      });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper elevation={3} sx={{ p: 3, maxWidth: 800, margin: 'auto' }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="h2">
              {activeStep === 0 ? 'Enter Payment Details' : 'Confirm Payment'}
            </Typography>
            <IconButton onClick={onCancel} size="small">
              <ArrowBack />
            </IconButton>
          </Box>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            <Step><StepLabel>Details</StepLabel></Step>
            <Step><StepLabel>Confirmation</StepLabel></Step>
          </Stepper>

          {activeStep === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Stack direction="row" spacing={1}>
                  <TextField
                    fullWidth
                    label="Loan Number"
                    value={loanNumber}
                    onChange={(e) => {
                      setLoanNumber(e.target.value);
                      if (errors.loanNumber) setErrors(prev => ({ ...prev, loanNumber: '' }));
                    }}
                    error={!!errors.loanNumber}
                    helperText={errors.loanNumber || (loanError && 'Loan not found')}
                    size="small"
                    disabled={!!loan}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">LN-</InputAdornment>
                      ),
                    }}
                  />
                  {!loan && (
                    <Button
                      variant="contained"
                      onClick={handleSearchLoan}
                      disabled={isLoanLoading || isSearching}
                      startIcon={isLoanLoading || isSearching ? <CircularProgress size={20} /> : <Search />}
                    >
                      {isLoanLoading || isSearching ? 'Searching...' : 'Find'}
                    </Button>
                  )}
                </Stack>
              </Grid>

              {loan && (
                <>
                  <Grid item xs={12}>
                    <Alert severity="success">
                      Found loan for {loan?.customer?.firstName} {loan?.customer?.lastName}
                    </Alert>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Amount (ETB)"
                      name="amount"
                      type="number"
                      value={paymentData.amount}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">ETB</InputAdornment>
                        ),
                      }}
                      required
                      error={!!errors.amount}
                      helperText={errors.amount}
                      size="small"
                      inputProps={{
                        min: "0.01",
                        step: "0.01"
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <DatePicker
                      label="Payment Date *"
                      value={paymentData.paymentDate}
                      onChange={(date) => {
                        setPaymentData(prev => ({ ...prev, paymentDate: date || new Date() }));
                        if (errors.paymentDate) setErrors(prev => ({ ...prev, paymentDate: '' }));
                      }}
                      maxDate={new Date()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: 'small',
                          error: !!errors.paymentDate,
                          helperText: errors.paymentDate
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Principal Amount"
                      name="principalAmount"
                      type="number"
                      value={paymentData.principalAmount}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">ETB</InputAdornment>
                        ),
                        readOnly: true
                      }}
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Interest Amount"
                      name="interestAmount"
                      type="number"
                      value={paymentData.interestAmount}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">ETB</InputAdornment>
                        ),
                        readOnly: true
                      }}
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth size="small" error={!!errors.method}>
                      <InputLabel>Payment Method *</InputLabel>
                      <Select
                        label="Payment Method *"
                        name="method"
                        value={paymentData.method}
                        onChange={(e) => {
                          setPaymentData(prev => ({ ...prev, method: e.target.value }));
                          if (errors.method) setErrors(prev => ({ ...prev, method: '' }));
                        }}
                        required
                      >
                        {paymentMethods.map((method) => (
                          <MenuItem key={method.value} value={method.value}>
                            <Stack direction="row" alignItems="center" gap={1}>
                              {method.icon}
                              {method.label}
                            </Stack>
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.method && (
                        <Typography variant="caption" color="error">
                          {errors.method}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Reference *"
                      name="reference"
                      value={paymentData.reference}
                      onChange={handleChange}
                      size="small"
                      placeholder="Receipt/Transaction #"
                      required
                      error={!!errors.reference}
                      helperText={errors.reference}
                      inputProps={{
                        minLength: 3
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Notes"
                      name="notes"
                      value={paymentData.notes}
                      onChange={handleChange}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          )}

          {activeStep === 1 && loan && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Payment Summary
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Loan Number:</Typography>
                  <Typography variant="subtitle2">Customer:</Typography>
                  <Typography variant="subtitle2">Amount:</Typography>
                  <Typography variant="subtitle2">Principal:</Typography>
                  <Typography variant="subtitle2">Interest:</Typography>
                  <Typography variant="subtitle2">Method:</Typography>
                  <Typography variant="subtitle2">Reference:</Typography>
                  <Typography variant="subtitle2">Date:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography fontWeight="bold">{loan.loanNumber}</Typography>
                  <Typography fontWeight="bold">{loan.customer.firstName} {loan.customer.lastName}</Typography>
                  <Typography fontWeight="bold">{paymentData.amount} ETB</Typography>
                  <Typography fontWeight="bold">{paymentData.principalAmount} ETB</Typography>
                  <Typography fontWeight="bold">{paymentData.interestAmount} ETB</Typography>
                  <Chip 
                    label={paymentMethods.find(m => m.value === paymentData.method)?.label} 
                    size="small"
                    icon={paymentMethods.find(m => m.value === paymentData.method)?.icon}
                    sx={{ mb: 0.5 }}
                  />
                  <Typography fontWeight="bold">{paymentData.reference}</Typography>
                  <Typography fontWeight="bold">
                    {format(paymentData.paymentDate, 'MMM dd, yyyy')}
                  </Typography>
                </Grid>
              </Grid>

              <Alert severity="info" sx={{ mt: 2 }}>
                Current balance: {loan.balance} ETB → New balance: {(parseFloat(loan.balance) - parseFloat(paymentData.principalAmount)).toFixed(2)} ETB
              </Alert>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button 
              onClick={activeStep === 0 ? onCancel : handleBack}
              variant="outlined"
              disabled={isLoading}
            >
              {activeStep === 0 ? 'Cancel' : 'Back'}
            </Button>
            
            {activeStep < 1 ? (
              <Button 
                onClick={handleNext}
                variant="contained"
                disabled={isLoading || !loan}
              >
                Next
              </Button>
            ) : (
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : <CheckCircle />}
              >
                {isLoading ? 'Processing...' : 'Confirm Payment'}
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
};

export default PaymentForm;