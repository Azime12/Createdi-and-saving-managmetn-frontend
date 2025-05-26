import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  CircularProgress
} from '@mui/material';
import { 
  Print as PrintIcon, 
  Share as ShareIcon,
  AttachMoney,
  AccountBalance,
  Payment,
  Receipt,
  CheckCircle,
  Close,
  Add,
  PictureAsPdf,
} from '@mui/icons-material';
import { format, parseISO, addMonths } from 'date-fns';
import { useCreateLoanPaymentMutation, useGetAllLoanPaymentsQuery } from '@/redux/api/loanPaymentApiSlice';
import { toast } from 'react-toastify';
import PaymentForm from './PaymentForm';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const statusColors = {
  pending: 'warning',
  active: 'success',
  paid: 'primary',
  defaulted: 'error',
  cancelled: 'default',
  completed: 'success',
  reversed: 'error',
  rejected: 'error'
};

const paymentMethodIcons = {
  cash: <AttachMoney />,
  bank_transfer: <AccountBalance />,
  mobile_money: <Payment />,
  check: <Receipt />,
  other: <Payment />
};

interface Payment {
  id: number;
  loanId: number;
  paymentNumber: number;
  amount: string;
  principalAmount: string;
  interestAmount: string;
  paymentDate: string;
  method: string;
  reference?: string;
  notes?: string;
  recordedBy?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface Customer {
  firstName: string;
  lastName: string;
  id: string;
  email?: string;
}

interface Loan {
  id: string;
  loanNumber: string;
  principalAmount: string;
  balance: string;
  interestRate: string;
  termMonths: number;
  disbursementDate: string;
  createdAt: string;
  dueDate: string;
  endDate?: string;
  lastPaymentDate?: string;
  status: string;
  customer: Customer;
}

interface LoanDetailsProps {
  loan: Loan;
}

const LoanDetails: React.FC<LoanDetailsProps> = ({ loan }) => {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [createPayment, { isLoading: isCreating }] = useCreateLoanPaymentMutation();
  const componentRef = useRef<HTMLDivElement>(null);
  
  // Convert string amounts to numbers for calculations
  const principalAmountNum = parseFloat(loan.principalAmount);
  const interestRateNum = parseFloat(loan.interestRate);
  const balanceNum = parseFloat(loan.balance);
  
  const totalInterest = (principalAmountNum * interestRateNum * loan.termMonths / 12).toFixed(2);
  const totalPayment = (principalAmountNum + parseFloat(totalInterest)).toFixed(2);
  const monthlyPayment = (parseFloat(totalPayment) / loan.termMonths).toFixed(2);

  // Fetch payments data
  const { data: paymentsData, isLoading: isLoadingPayments, error: paymentsError } = useGetAllLoanPaymentsQuery({
    loanId: loan?.id
  });

  const payments = paymentsData?.data?.rows || [];
  const paymentsCount = paymentsData?.data?.count || 0;

  const generatePaymentSchedule = () => {
    const schedule = [];
    const startDate = new Date(loan.disbursementDate);
    
    for (let i = 1; i <= loan.termMonths; i++) {
      const dueDate = addMonths(startDate, i);
      const payment = payments.find(p => p.paymentNumber === i);
      
      schedule.push({
        number: i,
        dueDate,
        amount: monthlyPayment,
        status: payment ? payment.status : i === 1 ? 'due' : 'pending',
        paymentDate: payment?.paymentDate,
        method: payment?.method
      });
    }
    
    return schedule;
  };

  const paymentSchedule = generatePaymentSchedule();

  const handlePaymentSubmit = async (paymentData: any) => {
    try {
      await createPayment({
        ...paymentData,
        loanId: loan.id
      }).unwrap();
      toast.success('Payment recorded successfully');
      setPaymentDialogOpen(false);
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to record payment');
    }
  };

  // Calculate payment stats
  const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0).toFixed(2);
  const principalPaid = payments.reduce((sum, p) => sum + parseFloat(p.principalAmount), 0).toFixed(2);
  const interestPaid = payments.reduce((sum, p) => sum + parseFloat(p.interestAmount), 0).toFixed(2);
  const completedPayments = payments.filter(p => p.status === 'completed').length;

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text(`Loan Details - ${loan.loanNumber}`, 14, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generated on ${format(new Date(), 'MMM dd, yyyy hh:mm a')}`, 14, 28);

    // Loan Summary
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('Loan Summary', 14, 40);
    
    autoTable(doc, {
      startY: 45,
      head: [['Field', 'Value']],
      body: [
        ['Principal Amount', `$${principalAmountNum.toLocaleString()}`],
        ['Current Balance', `$${balanceNum.toLocaleString()}`],
        ['Interest Rate', `${(interestRateNum * 100).toFixed(2)}%`],
        ['Term', `${loan.termMonths} months`],
        ['Monthly Payment', `$${monthlyPayment}`],
        ['Total Interest', `$${totalInterest}`],
        ['Total Payment', `$${totalPayment}`],
        ['Status', loan.status],
      ],
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
    });

    // Customer Information
    doc.text('Customer Information', 14, doc.lastAutoTable.finalY + 20);
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 25,
      head: [['Field', 'Value']],
      body: [
        ['Name', `${loan.customer.firstName} ${loan.customer.lastName}`],
        ['Customer ID', loan.customer.id],
        ['Email', loan.customer.email || 'N/A'],
      ],
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
    });

    // Key Dates
    doc.text('Key Dates', 14, doc.lastAutoTable.finalY + 20);
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 25,
      head: [['Field', 'Value']],
      body: [
        ['Disbursement Date', format(parseISO(loan.disbursementDate), 'MMM dd, yyyy')],
        ['Start Date', format(parseISO(loan.createdAt), 'MMM dd, yyyy')],
        ['Due Date', format(parseISO(loan.dueDate), 'MMM dd, yyyy')],
        ['End Date', loan.endDate ? format(parseISO(loan.endDate), 'MMM dd, yyyy') : 'N/A'],
        ['Last Payment', loan.lastPaymentDate ? format(parseISO(loan.lastPaymentDate), 'MMM dd, yyyy') : 'No payments yet'],
      ],
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
    });

    // Payment Stats
    doc.text('Payment Statistics', 14, doc.lastAutoTable.finalY + 20);
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 25,
      head: [['Field', 'Value']],
      body: [
        ['Payments Made', `${paymentsCount} of ${loan.termMonths}`],
        ['On Time Payments', completedPayments.toString()],
        ['Total Paid', `$${totalPaid}`],
        ['Principal Paid', `$${principalPaid}`],
        ['Interest Paid', `$${interestPaid}`],
      ],
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
    });

    // Payment History
    doc.text('Payment History', 14, doc.lastAutoTable.finalY + 20);
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 25,
      head: [['#', 'Date', 'Amount', 'Principal', 'Interest', 'Method', 'Status']],
      body: payments.map(payment => [
        payment.paymentNumber,
        format(parseISO(payment.paymentDate), 'MMM dd, yyyy'),
        `$${parseFloat(payment.amount).toFixed(2)}`,
        `$${parseFloat(payment.principalAmount).toFixed(2)}`,
        `$${parseFloat(payment.interestAmount).toFixed(2)}`,
        payment.method.replace('_', ' '),
        payment.status
      ]),
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
    });

    // Payment Schedule
    doc.text('Payment Schedule', 14, doc.lastAutoTable.finalY + 20);
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 25,
      head: [['#', 'Due Date', 'Amount', 'Status', 'Payment Date']],
      body: paymentSchedule.map(payment => [
        payment.number,
        format(payment.dueDate, 'MMM dd, yyyy'),
        `$${payment.amount}`,
        payment.status,
        payment.paymentDate ? format(parseISO(payment.paymentDate), 'MMM dd, yyyy') : '-'
      ]),
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
    });

    // Save the PDF
    doc.save(`loan_details_${loan.loanNumber}_${format(new Date(), 'yyyyMMdd')}.pdf`);
  };

  return (
    <Box ref={componentRef}>
      {/* Header with actions */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          Loan #{loan.loanNumber}
        </Typography>
        <Box>
          <Button 
            startIcon={<Add />} 
            variant="contained" 
            sx={{ mr: 2 }}
            onClick={() => setPaymentDialogOpen(true)}
          >
            Record Payment
          </Button>
          <Button 
            startIcon={<PictureAsPdf />} 
            variant="outlined" 
            sx={{ mr: 2 }}
            onClick={generatePDF}
          >
            generate PDF
          </Button>
        
        </Box>
      </Box>

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Overview" />
        <Tab label="Payment History" />
        <Tab label="Payment Schedule" />
        <Tab label="Documents" />
      </Tabs>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Left Column - Loan Summary */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Loan Summary
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Principal Amount:</Typography>
                  <Typography>${principalAmountNum.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Current Balance:</Typography>
                  <Typography>${balanceNum.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Interest Rate:</Typography>
                  <Typography>{(interestRateNum * 100).toFixed(2)}%</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Term:</Typography>
                  <Typography>{loan.termMonths} months</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Monthly Payment:</Typography>
                  <Typography>${monthlyPayment}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Total Interest:</Typography>
                  <Typography>${totalInterest}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Total Payment:</Typography>
                  <Typography>${totalPayment}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Status:</Typography>
                  <Chip 
                    label={loan.status} 
                    color={statusColors[loan.status as keyof typeof statusColors] || 'default'} 
                    size="small" 
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Customer Information */}
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Customer Information
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography>
                <strong>Name:</strong> {loan?.customer?.firstName} {loan?.customer?.lastName}
              </Typography>
              <Typography>
                <strong>Customer ID:</strong> {loan?.customer?.id}
              </Typography>
              {loan?.customer?.email && (
                <Typography>
                  <strong>Email:</strong> {loan?.customer?.email}
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Right Column - Dates */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Key Dates
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Disbursement Date:</Typography>
                  <Typography>{format(parseISO(loan.disbursementDate), 'MMM dd, yyyy')}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Start Date:</Typography>
                  <Typography>{format(parseISO(loan.createdAt), 'MMM dd, yyyy')}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Due Date:</Typography>
                  <Typography>{format(parseISO(loan.dueDate), 'MMM dd, yyyy')}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">End Date:</Typography>
                  <Typography>
                    {loan.endDate 
                      ? format(parseISO(loan.endDate), 'MMM dd, yyyy')
                      : 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Last Payment:</Typography>
                  <Typography>
                    {loan.lastPaymentDate 
                      ? format(parseISO(loan.lastPaymentDate), 'MMM dd, yyyy')
                      : 'No payments yet'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Quick Stats */}
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Payment Stats
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Payments Made:</Typography>
                  <Typography>{paymentsCount} of {loan.termMonths}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">On Time Payments:</Typography>
                  <Typography>{completedPayments}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Total Paid:</Typography>
                  <Typography>${totalPaid}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Principal Paid:</Typography>
                  <Typography>${principalPaid}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Interest Paid:</Typography>
                  <Typography>${interestPaid}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Payment History
          </Typography>
          <Divider sx={{ my: 2 }} />
          {isLoadingPayments ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : paymentsError ? (
            <Box display="flex" justifyContent="center" py={4}>
              <Typography color="error">Error loading payments</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Principal</TableCell>
                    <TableCell>Interest</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell>Reference</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.length > 0 ? (
                    payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.paymentNumber}</TableCell>
                        <TableCell>{format(parseISO(payment.paymentDate), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>
                          {parseFloat(payment.amount).toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          })}
                        </TableCell>
                        <TableCell>
                          {parseFloat(payment.principalAmount).toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          })}
                        </TableCell>
                        <TableCell>
                          {parseFloat(payment.interestAmount).toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          })}
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={paymentMethodIcons[payment.method as keyof typeof paymentMethodIcons]}
                            label={payment.method.replace('_', ' ')}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          {payment.reference || '-'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={payment.status}
                            color={statusColors[payment.status as keyof typeof statusColors]}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                        <Typography>No payments recorded yet</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}

      {activeTab === 2 && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Payment Schedule
          </Typography>
          <Divider sx={{ my: 2 }} />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Payment Date</TableCell>
                  <TableCell>Method</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentSchedule.map((payment) => (
                  <TableRow key={payment.number}>
                    <TableCell>{payment.number}</TableCell>
                    <TableCell>
                      {format(payment.dueDate, 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      ${payment.amount}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={payment.status}
                        color={
                          payment.status === 'completed' ? 'success' :
                          payment.status === 'due' ? 'warning' : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {payment.paymentDate 
                        ? format(parseISO(payment.paymentDate), 'MMM dd, yyyy')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {payment.method ? (
                        <Chip
                          icon={paymentMethodIcons[payment.method as keyof typeof paymentMethodIcons]}
                          label={payment.method.replace('_', ' ')}
                          size="small"
                          variant="outlined"
                        />
                      ) : (
                        '-'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {activeTab === 3 && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Loan Documents
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography color="textSecondary">
            No documents attached to this loan.
          </Typography>
          <Button variant="outlined" sx={{ mt: 2 }}>
            Upload Document
          </Button>
        </Paper>
      )}

      {/* Payment Dialog */}
      <Dialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Record Payment for Loan #{loan.loanNumber}
        </DialogTitle>
        <DialogContent dividers>
          <PaymentForm 
            loanNumber={loan.loanNumber}
            autoFetchLoan={true}
            onSubmit={handlePaymentSubmit}
            isLoading={isCreating}
            onCancel={() => setPaymentDialogOpen(false)}
            showLoanSearch={false}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default LoanDetails;