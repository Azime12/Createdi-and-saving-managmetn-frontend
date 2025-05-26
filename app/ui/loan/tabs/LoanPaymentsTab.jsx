'use client';
import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Stack,
  DialogContentText,
  Alert,
  Tooltip,
  useMediaQuery
} from '@mui/material';
import { 
  Search, 
  Refresh, 
  AttachMoney, 
  Receipt, 
  Payment, 
  History, 
  Add, 
  CheckCircle,
  Cancel,
  TrendingUp,
  AccountBalance,
  Verified,
  GppMaybe,
  PendingActions,
  ReceiptLong,
  Description
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parseISO } from 'date-fns';
import { useTheme } from '@mui/material/styles';
import { useGetAllLoanPaymentsQuery, useCreateLoanPaymentMutation, useVerifyLoanPaymentMutation } from '@/redux/api/loanPaymentApiSlice';
import PaymentForm from './PaymentForm';
import { toast } from 'react-toastify';
// Add these imports at the top
import { PictureAsPdf as PictureAsPdfIcon } from '@mui/icons-material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Add this function inside your LoanPaymentsTab component
const generatePaymentPDF = (payment) => {
  const doc = new jsPDF();
  
  // Add logo or header
  doc.setFontSize(18);
  doc.setTextColor(40);
  doc.text('Payment Receipt', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(`Generated on ${format(new Date(), 'MMM d, yyyy hh:mm a')}`, 105, 28, { align: 'center' });
  
  // Payment details
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text(`Payment #${payment.paymentNumber}`, 14, 40);
  
  // Add horizontal line
  doc.setDrawColor(200);
  doc.line(14, 45, 196, 45);
  
  // Payment information table
  autoTable(doc, {
    startY: 50,
    head: [['Payment Details', '']],
    body: [
      ['Amount', `${parseFloat(payment.amount).toLocaleString('en-US', {
        style: 'currency',
        currency: 'ETB',
        minimumFractionDigits: 2
      })}`],
      ['Principal', `${parseFloat(payment.principalAmount).toLocaleString('en-US', {
        style: 'currency',
        currency: 'ETB',
        minimumFractionDigits: 2
      })}`],
      ['Interest', `${parseFloat(payment.interestAmount).toLocaleString('en-US', {
        style: 'currency',
        currency: 'ETB',
        minimumFractionDigits: 2
      })}`],
      ['Method', payment.method.replace('_', ' ')],
      ['Reference', payment.reference || 'N/A'],
      ['Status', payment.status],
      ['Payment Date', format(new Date(payment.paymentDate), 'MMM d, yyyy')],
    ],
    theme: 'grid',
    headStyles: { 
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 70 },
      1: { cellWidth: 'auto' }
    },
    margin: { left: 14 }
  });
  
  // Loan information table
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [['Loan Details', '']],
    body: [
      ['Loan Number', payment.loan?.loanNumber || 'N/A'],
      ['Customer', `${payment.loan?.customer?.firstName || ''} ${payment.loan?.customer?.lastName || ''}`],
      ['Principal Amount', `${parseFloat(payment.loan?.principalAmount).toLocaleString('en-US', {
        style: 'currency',
        currency: 'ETB',
        minimumFractionDigits: 2
      })}`],
      ['Current Balance', `${parseFloat(payment.loan?.balance).toLocaleString('en-US', {
        style: 'currency',
        currency: 'ETB',
        minimumFractionDigits: 2
      })}`],
      ['Interest Rate', `${(parseFloat(payment.loan?.interestRate) * 100).toFixed(2)}%`],
      ['Term', `${payment.loan?.termMonths} months`],
      ['Disbursement Date', format(new Date(payment.loan?.disbursementDate), 'MMM d, yyyy')],
    ],
    theme: 'grid',
    headStyles: { 
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 70 },
      1: { cellWidth: 'auto' }
    },
    margin: { left: 14 }
  });
  
  // Add notes if available
  if (payment.notes) {
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text('Notes:', 14, doc.lastAutoTable.finalY + 15);
    
    doc.setFontSize(10);
    doc.setTextColor(0);
    const splitNotes = doc.splitTextToSize(payment.notes, 180);
    doc.text(splitNotes, 14, doc.lastAutoTable.finalY + 20);
  }
  
  // Add footer
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text('This is an official payment receipt', 105, 285, { align: 'center' });
  
  // Save the PDF
  doc.save(`payment_receipt_${payment.paymentNumber}_${format(new Date(), 'yyyyMMdd')}.pdf`);
};
const statusColors = {
  pending: 'warning',
  completed: 'success',
  reversed: 'error',
  rejected: 'error'
};

const paymentMethodIcons = {
  cash: <AttachMoney fontSize="small" />,
  bank_transfer: <AccountBalance fontSize="small" />,
  mobile_money: <Payment fontSize="small" />,
  check: <Receipt fontSize="small" />,
  other: <Payment fontSize="small" />
};

const actionIcons = {
  approve: <Verified color="success" />,
  reject: <GppMaybe color="error" />,
  pending: <PendingActions color="warning" />
};

const LoanPaymentsTab = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [verificationAction, setVerificationAction] = useState('approve');
  const [verificationReason, setVerificationReason] = useState('');
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  
  const {
    data: payments,
    isLoading,
    isError,
    error,
    refetch
  } = useGetAllLoanPaymentsQuery();
  const [createPayment, { isLoading: isCreating }] = useCreateLoanPaymentMutation();
  const [verifyPayment, { isLoading: isVerifying }] = useVerifyLoanPaymentMutation();

  const filteredPayments = payments?.data?.rows?.filter(payment => {
    const matchesSearch = !searchTerm || 
      payment.loan?.loanNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${payment.loan?.customer?.firstName} ${payment.loan?.customer?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.amount.toString().includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter;
    
    const paymentDate = new Date(payment.paymentDate);
    const matchesDate = (!startDate || paymentDate >= startDate) && 
                       (!endDate || paymentDate <= endDate);
    
    return matchesSearch && matchesStatus && matchesMethod && matchesDate;
  }) || [];

  const handleCreatePayment = async (paymentData) => {
    try {
      await createPayment(paymentData).unwrap();
      toast.success('Payment recorded successfully');
      setPaymentDialogOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.data?.message || 'Failed to record payment');
    }
  };

  const handleVerifyPayment = async () => {
    try {
      if (!selectedPayment?.id) {
        throw new Error('No payment selected');
      }

      const payload = {
        paymentId: Number(selectedPayment.id),
        action: verificationAction === 'approve' ? 'approve' : 'reject',
        ...(verificationAction === 'reject' && {
          reason: verificationReason || 'Payment rejected',
        }),
      };

      await verifyPayment(payload).unwrap();

      toast.success(`Payment ${verificationAction}d successfully`);
      setVerifyDialogOpen(false);
      refetch();
    } catch (err) {
      console.error('Error verifying payment:', err);
      toast.error(
        err.message ||
        err.data?.message ||
        `Failed to ${verificationAction} payment`
      );
    }
  };

  const openViewDialog = (payment) => {
    setSelectedPayment(payment);
    setViewDialogOpen(true);
  };

  const openVerifyDialog = (payment, action) => {
    setSelectedPayment(payment);
    setVerificationAction(action);
    setVerificationReason('');
    setVerifyDialogOpen(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Card sx={{ p: 2, mb: 3, borderRadius: 2, boxShadow: theme.shadows[1] }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Search Payments"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Loan #, Customer, Amount, Reference..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 1,
                    '&:hover': {
                      borderColor: 'primary.main',
                    },
                  }
                }}
              />
            </Grid>

            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="reversed">Reversed</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Method</InputLabel>
                <Select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  label="Method"
                >
                  <MenuItem value="all">All Methods</MenuItem>
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                  <MenuItem value="mobile_money">Mobile Money</MenuItem>
                  <MenuItem value="check">Check</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6} md={2}>
              <DatePicker
                label="From Date"
                value={startDate}
                onChange={setStartDate}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                  },
                }}
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <DatePicker
                label="To Date"
                value={endDate}
                onChange={setEndDate}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4} md={3} lg={2}>
              <Button
                fullWidth
                variant="contained"
                size="small"
                startIcon={<Add fontSize="small" />}
                onClick={() => {
                  setSelectedLoanId(null);
                  setPaymentDialogOpen(true);
                }}
                sx={{
                  whiteSpace: 'nowrap',
                  minWidth: 'fit-content'
                }}
              >
                New Payment
              </Button>
            </Grid>
          </Grid>
        </Card>

        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Recent Payments" icon={<History fontSize="small" />} />
          <Tab label="Payment Summary" icon={<TrendingUp fontSize="small" />} />
        </Tabs>

        {activeTab === 0 && (
          <>
            <Box sx={{ width: '100%', overflowX: 'auto' }}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 1000 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Payment #</TableCell>
                      <TableCell>Loan #</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Amount (ETB)</TableCell>
                      <TableCell>Principal (ETB)</TableCell>
                      <TableCell>Interest (ETB)</TableCell>
                      <TableCell>Method</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : isError ? (
                      <TableRow>
                        <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                          <Typography color="error">Error: {error.message}</Typography>
                        </TableCell>
                      </TableRow>
                    ) : filteredPayments.length > 0 ? (
                      filteredPayments
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((payment) => (
                          <TableRow key={payment.id} hover>
                            <TableCell>{payment.paymentNumber}</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                              {payment.loan?.loanNumber || '-'}
                            </TableCell>
                            <TableCell>
                              {payment?.loan?.customer?.firstName || '-'} {payment?.loan?.customer?.lastName || ''}
                            </TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                              {parseFloat(payment.amount).toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'ETB',
                                minimumFractionDigits: 2
                              })}
                            </TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                              {parseFloat(payment.principalAmount).toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'ETB',
                                minimumFractionDigits: 2
                              })}
                            </TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                              {parseFloat(payment.interestAmount).toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'ETB',
                                minimumFractionDigits: 2
                              })}
                            </TableCell>
                            <TableCell>
                              <Chip
                                icon={paymentMethodIcons[payment.method]}
                                label={payment.method.replace('_', ' ')}
                                variant="outlined"
                                size="small"
                              />
                            </TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                              {payment.paymentDate ? format(new Date(payment.paymentDate), 'MMM d, yyyy') : '-'}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={payment.status}
                                color={statusColors[payment.status]}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={1}>
                                <Tooltip title="View Payment Details">
                                  <IconButton
                                    color="primary"
                                    size="small"
                                    onClick={() => openViewDialog(payment)}
                                  >
                                    <ReceiptLong />
                                  </IconButton>
                                </Tooltip>
                                {payment.status === 'pending' && (
                                  <>
                                    <Tooltip title="Approve Payment">
                                      <IconButton
                                        color="success"
                                        size="small"
                                        onClick={() => openVerifyDialog(payment, 'approve')}
                                      >
                                        <CheckCircle />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Reject Payment">
                                      <IconButton
                                        color="error"
                                        size="small"
                                        onClick={() => openVerifyDialog(payment, 'reject')}
                                      >
                                        <Cancel />
                                      </IconButton>
                                    </Tooltip>
                                  </>
                                )}
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                          <Typography>No payments found</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredPayments.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}

        {activeTab === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Payment Methods Distribution
                </Typography>
                {/* Add a chart here for payment methods */}
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Monthly Payments Trend
                </Typography>
                {/* Add a chart here for payment trends */}
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Payment Dialog */}
        <Dialog
          open={paymentDialogOpen}
          onClose={() => setPaymentDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {selectedLoanId ? 'Record Payment' : 'New Loan Payment'}
          </DialogTitle>
          <DialogContent dividers>
            <PaymentForm 
              loanId={selectedLoanId}
              onSubmit={handleCreatePayment}
              isLoading={isCreating}
              onCancel={() => setPaymentDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Payment View Dialog */}
        <Dialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Box display="flex" alignItems="center">
        <Description color="primary" sx={{ mr: 1 }} />
        Payment Details
      </Box>
      <Button 
        startIcon={<PictureAsPdfIcon />}
        variant="outlined"
        size="small"
        onClick={() => generatePaymentPDF(selectedPayment)}
        sx={{ ml: 2 }}
      >
        Export PDF
      </Button>
    </Box>
  </DialogTitle>
          <DialogContent dividers>
            {selectedPayment && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Payment #{selectedPayment.paymentNumber}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Payment Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Amount" 
                        secondary={`${parseFloat(selectedPayment.amount).toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'ETB',
                          minimumFractionDigits: 2
                        })}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Principal" 
                        secondary={`${parseFloat(selectedPayment.principalAmount).toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'ETB',
                          minimumFractionDigits: 2
                        })}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Interest" 
                        secondary={`${parseFloat(selectedPayment.interestAmount).toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'ETB',
                          minimumFractionDigits: 2
                        })}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Method" 
                        secondary={
                          <Chip
                            icon={paymentMethodIcons[selectedPayment.method]}
                            label={selectedPayment.method.replace('_', ' ')}
                            variant="outlined"
                            size="small"
                          />
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Reference" 
                        secondary={selectedPayment.reference || 'N/A'} 
                      />
                    </ListItem>
                  </List>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Loan Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Loan Number" 
                        secondary={selectedPayment.loan?.loanNumber || 'N/A'} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Customer" 
                        secondary={`${selectedPayment.loan?.customer?.firstName || ''} ${selectedPayment.loan?.customer?.lastName || ''}`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Payment Date" 
                        secondary={format(new Date(selectedPayment.paymentDate), 'MMM d, yyyy')} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Status" 
                        secondary={
                          <Chip
                            label={selectedPayment.status}
                            color={statusColors[selectedPayment.status]}
                            size="small"
                          />
                        }
                      />
                    </ListItem>
                  </List>
                </Grid>

                {selectedPayment.notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Notes
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="body2">
                        {selectedPayment.notes}
                      </Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Verification Dialog */}
        <Dialog
          open={verifyDialogOpen}
          onClose={() => setVerifyDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {verificationAction === 'approve' ? 'Approve Payment' : 'Reject Payment'}
          </DialogTitle>
          <DialogContent dividers>
            {selectedPayment && (
              <>
                <DialogContentText gutterBottom>
                  You are about to <strong>{verificationAction}</strong> payment #{selectedPayment.paymentNumber} for loan #{selectedPayment.loan?.loanNumber}.
                </DialogContentText>
                
                <Box sx={{ my: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2">Payment Details</Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText 
                            primary="Amount" 
                            secondary={`${parseFloat(selectedPayment.amount).toLocaleString('en-US', {
                              style: 'currency',
                              currency: 'ETB',
                              minimumFractionDigits: 2
                            })}`} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Method" 
                            secondary={
                              <Chip
                                icon={paymentMethodIcons[selectedPayment.method]}
                                label={selectedPayment.method.replace('_', ' ')}
                                variant="outlined"
                                size="small"
                              />
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Reference" 
                            secondary={selectedPayment.reference || 'N/A'} 
                          />
                        </ListItem>
                      </List>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2">Loan Details</Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText 
                            primary="Customer" 
                            secondary={`${selectedPayment.loan?.customer?.firstName} ${selectedPayment.loan?.customer?.lastName}`} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Current Balance" 
                            secondary={`${parseFloat(selectedPayment.loan?.balance).toLocaleString('en-US', {
                              style: 'currency',
                              currency: 'ETB',
                              minimumFractionDigits: 2
                            })}`} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Payment Date" 
                            secondary={format(new Date(selectedPayment.paymentDate), 'MMM d, yyyy')} 
                          />
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                </Box>

                {verificationAction === 'reject' && (
                  <>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      Please verify the payment details with the bank transaction before rejecting.
                    </Alert>
 
<Box sx={{ mt: 2 }}>
  <TextField
    fullWidth
    // multiline
          // rows={4}
    // label="Reason for Rejection"
    value={verificationReason}
    onChange={(e) => setVerificationReason(e.target.value)}
    required
    error={verificationAction === 'reject' && !verificationReason}
    helperText={
      verificationAction === 'reject' && !verificationReason
        ? 'Reason is required for rejection'
        : 'Please provide a detailed reason for rejecting this payment'
    }
   
    
  />
</Box>

                  </>
                )}

                {verificationAction === 'approve' && (
                  <Alert severity="info">
                    Approving this payment will update the loan balance and mark it as completed.
                    Please verify the payment details with the bank transaction before approving.
                  </Alert>
                )}
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setVerifyDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleVerifyPayment}
              variant="contained"
              color={verificationAction === 'approve' ? 'success' : 'error'}
              disabled={isVerifying || (verificationAction === 'reject' && !verificationReason)}
              startIcon={isVerifying ? <CircularProgress size={20} /> : actionIcons[verificationAction]}
            >
              {isVerifying ? 'Processing...' : `${verificationAction.charAt(0).toUpperCase() + verificationAction.slice(1)} Payment`}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default LoanPaymentsTab;