import React, { useState, useEffect } from 'react';
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
  IconButton,
  InputAdornment,
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
  useMediaQuery,
} from '@mui/material';
import { format } from 'date-fns';
import { useTheme } from '@mui/material/styles';
import { toast } from 'react-toastify';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useGetAllLoanApplicationsQuery, useUpdateLoanApplicationStatusMutation } from '@/redux/api/loanApplicationApiSlice';
import { HistoryIcon } from 'lucide-react';

const statusColors = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
  cancelled: 'default',
};

const LoanApplicationDetails = ({ application }) => {
  const theme = useTheme();

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Customer Information
          </Typography>
          <Typography>
            <strong>Name:</strong> {application.customer?.firstName} {application.customer?.lastName}
          </Typography>
          <Typography>
            <strong>Email:</strong> {application.customer?.email}
          </Typography>
          <Typography>
            <strong>Phone:</strong> {application.customer?.phone || 'N/A'}
          </Typography>
          <Typography>
            <strong>Application #:</strong> {application.applicationNumber}
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Loan Details
          </Typography>
          <Typography>
            <strong>Type:</strong> {application.loanType?.name}
          </Typography>
          <Typography>
            <strong>Amount:</strong> {parseFloat(application.principalAmount).toLocaleString('en-US', {
              style: 'currency',
              currency: 'ETB',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
          <Typography>
            <strong>Term:</strong> {application.termMonths} months
          </Typography>
          <Typography>
            <strong>Interest Rate:</strong> {application.loanType?.interest_rate}%
          </Typography>
        </Grid>
      </Grid>

      <Box mt={3}>
        <Typography variant="subtitle1" gutterBottom>
          Purpose
        </Typography>
        <Typography>{application.purpose || 'Not specified'}</Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Timeline
          </Typography>
          <Typography>
            <strong>Created At:</strong> {format(new Date(application.createdAt), 'PPpp')}
          </Typography>
          {application.finalDecisionDate && (
            <Typography>
              <strong>Decision Date:</strong> {format(new Date(application.finalDecisionDate), 'PPpp')}
            </Typography>
          )}
        </Grid>

        {application.finalDecision && (
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Decision Details
            </Typography>
            <Typography>
              <strong>Status:</strong> {application.finalDecision.status}
            </Typography>
            <Typography>
              <strong>Decision By:</strong> {application.decisionMaker?.firstName || 'System'}
            </Typography>
            {application.finalDecision.notes && (
              <Typography>
                <strong>Notes:</strong> {application.finalDecision.notes}
              </Typography>
            )}
          </Grid>
        )}
      </Grid>

{application.decisionHistory?.length > 0 && (
  <Box mt={4}>
    <Typography variant="h6" gutterBottom sx={{ 
      fontWeight: 600,
      color: theme.palette.text.primary,
      display: 'flex',
      alignItems: 'center',
      gap: 1
    }}>
      <HistoryIcon color="primary" /> Decision History Timeline
    </Typography>
    
    <Box sx={{ 
      position: 'relative',
      pl: 3,
      ml: 1,
      borderLeft: `2px solid ${theme.palette.divider}`
    }}>
      {application.decisionHistory.map((decision, index) => {
        const decisionDate = decision.decidedAt ? new Date(decision.decidedAt) : null;
        const formattedDate = decisionDate && !isNaN(decisionDate) 
          ? format(decisionDate, 'MMM dd, yyyy - hh:mm a') 
          : 'Date not available';
        
        const isLastItem = index === application.decisionHistory.length - 1;
        const statusColor = statusColors[decision.status] || 'default';

        return (
          <Box 
            key={index} 
            sx={{ 
              position: 'relative',
              mb: isLastItem ? 0 : 3,
              pb: isLastItem ? 0 : 2,
              '&:before': {
                content: '""',
                position: 'absolute',
                left: -29,
                top: 8,
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: theme.palette[statusColor].main,
                border: `2px solid ${theme.palette.background.paper}`,
                zIndex: 1
              }
            }}
          >
            <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Chip
                    label={decision.status.toUpperCase()}
                    color={statusColor}
                    size="small"
                    sx={{ 
                      fontWeight: 600,
                      mb: 1 
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {formattedDate}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  By: {decision.decidedBy === application.customer?.id ? 
                    'Customer' : 
                    (decision.decidedBy ? 'Staff' : 'System')}
                </Typography>
              </Box>
              
              {decision.comments && (
                <Box mt={1.5} sx={{ 
                  backgroundColor: theme.palette.grey[100],
                  p: 1.5,
                  borderRadius: 1
                }}>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Decision Notes:
                  </Typography>
                  <Typography variant="body2">
                    {decision.comments || 'No additional comments provided'}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        );
      })}
    </Box>
  </Box>
)}
    </Box>
  );
};

const LoanApplicationsTab = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [decisionDialogOpen, setDecisionDialogOpen] = useState(false);
  const [decision, setDecision] = useState('approved');
  const [decisionNotes, setDecisionNotes] = useState('');
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Debounce search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(0); // Reset to first page when search term changes
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetAllLoanApplicationsQuery({
    page: page + 1,
    limit: rowsPerPage,
  });

  const [updateStatus, { isLoading: isUpdating }] = useUpdateLoanApplicationStatusMutation();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDecisionDialog = (application) => {
    setSelectedApplication(application);
    setDecisionDialogOpen(true);
  };

  const handleOpenDetailDialog = (application) => {
    setSelectedApplication(application);
    setDetailDialogOpen(true);
  };

  const handleCloseDecisionDialog = () => {
    setDecisionDialogOpen(false);
    setSelectedApplication(null);
    setDecision('approved');
    setDecisionNotes('');
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setSelectedApplication(null);
  };

  const handleUpdateStatus = async () => {
    try {
      await updateStatus({
        id: selectedApplication.id,
        status: decision,
        decisionBy: 'admin-id-here', // Replace with actual admin ID from auth
        comments: decisionNotes,
      }).unwrap();
      toast.success(`Application ${decision} successfully`);
      refetch();
      handleCloseDecisionDialog();
    } catch (err) {
      toast.error(`Failed to update application: ${err.data?.message || err.message}`);
    }
  };

  // Client-side filtering
  const filteredApplications = React.useMemo(() => {
    if (!response?.data) return [];
    
    let result = [...response.data];
    
    // Apply search term filter
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      result = result.filter(app => 
        app.applicationNumber.toLowerCase().includes(searchLower) ||
        (app.customer?.firstName?.toLowerCase().includes(searchLower)) ||
        (app.customer?.lastName?.toLowerCase().includes(searchLower)) ||
        (app.customer?.email?.toLowerCase().includes(searchLower)) ||
        (app.loanType?.name?.toLowerCase().includes(searchLower)) ||
        app.principalAmount.toString().includes(debouncedSearchTerm) ||
        app.termMonths.toString().includes(debouncedSearchTerm)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(app => app.status === statusFilter);
    }
    
    return result;
  }, [response?.data, debouncedSearchTerm, statusFilter]);

  const totalCount = response?.pagination?.total || 0;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">Error: {error.data?.message || error.message}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Card sx={{ p: { xs: 1, md: 3 }, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Search Applications"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by app #, name, email..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                sx: { 
                  backgroundColor: theme.palette.background.paper,
                  '&:hover, &:focus-within': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    }
                  }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Select
              fullWidth
              size="small"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
              displayEmpty
              inputProps={{ 'aria-label': 'Select status' }}
              sx={{ 
                backgroundColor: theme.palette.background.paper,
                '&:hover, &:focus': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  }
                }
              }}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} md={4} textAlign="right">
            <Button 
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => refetch()}
              disabled={isFetching}
              sx={{
                height: '40px',
                borderRadius: '4px',
              }}
            >
              {isFetching ? 'Refreshing...' : 'Refresh'}
            </Button>
          </Grid>
        </Grid>
      </Card>

      <Paper sx={{ width: '100%', overflow: 'hidden', mb: 2 }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)', overflowX: 'auto' }}>
          <Table stickyHeader aria-label="loan applications table" size={isSmallScreen ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 120 }}>Application #</TableCell>
                <TableCell sx={{ minWidth: 180 }}>Customer</TableCell>
                <TableCell sx={{ minWidth: 120 }}>Loan Type</TableCell>
                <TableCell sx={{ minWidth: 120 }}>Amount (ETB)</TableCell>
                <TableCell sx={{ minWidth: 100 }}>Term</TableCell>
                <TableCell sx={{ minWidth: 120 }}>Status</TableCell>
                <TableCell sx={{ minWidth: 120 }}>Created</TableCell>
                <TableCell sx={{ minWidth: 150 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredApplications.length > 0 ? (
                filteredApplications.map((application) => (
                  <TableRow key={application.id} hover>
                    <TableCell>
                      <Typography variant="body2" noWrap>
                        {application.applicationNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ minWidth: isSmallScreen ? 150 : 200 }}>
                        <Typography variant="body2">
                          {application.customer?.firstName} {application.customer?.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {application.customer?.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {application.loanType?.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {parseFloat(application.principalAmount).toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'ETB',
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {application.termMonths} months
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={application.status}
                        color={statusColors[application.status] || 'default'}
                        size="small"
                        sx={{ 
                          textTransform: 'capitalize',
                          minWidth: 80,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {isSmallScreen ? (
                          format(new Date(application.createdAt), 'MM/dd/yy')
                        ) : (
                          format(new Date(application.createdAt), 'MMM dd, yyyy')
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1} sx={{ flexWrap: isSmallScreen ? 'wrap' : 'nowrap' }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleOpenDetailDialog(application)}
                          sx={{ 
                            minWidth: 60,
                            fontSize: isSmallScreen ? '0.75rem' : '0.875rem',
                          }}
                        >
                          View
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleOpenDecisionDialog(application)}
                          disabled={application.status !== 'pending'}
                          color="primary"
                          sx={{ 
                            minWidth: 80,
                            fontSize: isSmallScreen ? '0.75rem' : '0.875rem',
                          }}
                        >
                          Manage
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No loan applications found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredApplications.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: `1px solid ${theme.palette.divider}` }}
        />
      </Paper>

      {/* Decision Dialog */}
      <Dialog open={decisionDialogOpen} onClose={handleCloseDecisionDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Manage Application: {selectedApplication?.applicationNumber}
        </DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <>
              <Box mb={3}>
                <Typography variant="subtitle1">Customer Information</Typography>
                <Typography>
                  {selectedApplication.customer?.firstName} {selectedApplication.customer?.lastName}
                </Typography>
                <Typography color="text.secondary">{selectedApplication.customer?.email}</Typography>
              </Box>

              <Box mb={3}>
                <Typography variant="subtitle1">Loan Details</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography>Type: {selectedApplication.loanType?.name}</Typography>
                    <Typography>
                      Amount:{' '}
                      {parseFloat(selectedApplication.principalAmount).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'ETB',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Term: {selectedApplication.termMonths} months</Typography>
                    <Typography>
                      Interest Rate: {selectedApplication.loanType?.interest_rate}%
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Box mb={3}>
                <Typography variant="subtitle1">Purpose</Typography>
                <Typography>{selectedApplication.purpose || 'Not specified'}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box mb={2}>
                <Typography variant="subtitle1">Decision</Typography>
                <Select
                  fullWidth
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="approved">Approve</MenuItem>
                  <MenuItem value="rejected">Reject</MenuItem>
                  <MenuItem value="cancelled">Cancel</MenuItem>
                </Select>

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Decision Notes"
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  placeholder="Add any notes about your decision..."
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDecisionDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            color={
              decision === 'approved'
                ? 'success'
                : decision === 'rejected'
                ? 'error'
                : 'primary'
            }
            disabled={isUpdating}
            endIcon={isUpdating ? <CircularProgress size={20} /> : null}
          >
            {isUpdating ? 'Processing...' : 'Submit Decision'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Details Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={handleCloseDetailDialog}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          Application Details: {selectedApplication?.applicationNumber}
        </DialogTitle>
        <DialogContent dividers>
          {selectedApplication && (
            <LoanApplicationDetails application={selectedApplication} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailDialog} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoanApplicationsTab;