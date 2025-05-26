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
  InputLabel,
  FormControl,
  IconButton
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import { useTheme } from '@mui/material/styles';
import { toast } from 'react-toastify';
import { useGetLoansQuery } from '@/redux/api/loanApiSlice';
import { Search, Refresh, FilterList, Clear } from '@mui/icons-material';
import LoanDetails from './LoanDetails';

const statusColors = {
  pending: 'warning',
  active: 'success',
  paid: 'primary',
  defaulted: 'error',
  cancelled: 'default',
};

const ActiveLoansTab = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Fetch all loans (without server-side filtering)
  const { 
    data: loansData, 
    isLoading, 
    isError, 
    error, 
    isFetching 
  } = useGetLoansQuery();

  // Client-side filtering function
  const filteredLoans = loansData?.data?.filter(loan => {
    // Search term matching
    const matchesSearch = !searchTerm || 
      loan.loanNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${loan.customer?.firstName} ${loan.customer?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.principalAmount.toString().includes(searchTerm);

    // Status filter matching
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;

    // Date range matching
    const loanDate = new Date(loan.createdAt);
    const matchesDate = (!startDate || loanDate >= startDate) && 
                       (!endDate || loanDate <= endDate);

    return matchesSearch && matchesStatus && matchesDate;
  }) || [];

  // Pagination calculations
  const paginatedLoans = filteredLoans.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setStartDate(null);
    setEndDate(null);
    setPage(0);
  };

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
        <Typography color="error">Error: {error.message}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Filter Card */}
      <Card sx={{ p: 2, mb: 3, borderRadius: 2, boxShadow: theme.shadows[1] }}>
        <Grid container spacing={2} alignItems="center">
          {/* Search Field */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Search Loans"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Loan #, name, email..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <IconButton
                    size="small"
                    onClick={() => setSearchTerm('')}
                  >
                    <Clear fontSize="small" />
                  </IconButton>
                )
              }}
            />
          </Grid>

          {/* Status Filter */}
          <Grid item xs={6} sm={3} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                {Object.entries(statusColors).map(([status, color]) => (
                  <MenuItem key={status} value={status}>
                    <Chip 
                      label={status} 
                      size="small" 
                      color={color} 
                      sx={{ mr: 1, textTransform: 'capitalize' }} 
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Date Range Filters */}
          <Grid item xs={6} sm={3} md={3}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="From Date"
              InputLabelProps={{ shrink: true }}
              value={startDate?.toISOString().split('T')[0] || ''}
              onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
            />
          </Grid>
          <Grid item xs={6} sm={3} md={3}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="To Date"
              InputLabelProps={{ shrink: true }}
              value={endDate?.toISOString().split('T')[0] || ''}
              onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
            />
          </Grid>

          {/* Reset Button */}
          <Grid item xs={6} sm={3} md={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleResetFilters}
              disabled={!searchTerm && statusFilter === 'all' && !startDate && !endDate}
              startIcon={<Refresh fontSize="small" />}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Loans Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Loan #</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Principal</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Balance</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Created</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isFetching ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : filteredLoans.length > 0 ? (
              paginatedLoans.map((loan) => (
                <TableRow key={loan.id} hover>
                  <TableCell>{loan.loanNumber}</TableCell>
                  <TableCell>
                    <Typography fontWeight="medium">
                      {loan.customer?.firstName} {loan.customer?.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {loan.customer?.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {loan.principalAmount?.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    })}
                  </TableCell>
                  <TableCell>
                    {loan.balance?.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    })}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={loan.status}
                      color={statusColors[loan.status] || 'default'}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell>
                    {loan.createdAt ? format(parseISO(loan.createdAt), 'MMM dd, yyyy') : '-'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setSelectedLoan(loan);
                        setDetailDialogOpen(true);
                      }}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No loans found matching your criteria
                  </Typography>
                  <Button
                    variant="text"
                    onClick={handleResetFilters}
                    sx={{ mt: 1 }}
                    startIcon={<Refresh />}
                  >
                    Reset Filters
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredLoans.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ mt: 2 }}
      />

      {/* Loan Details Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: theme.palette.primary.main, color: 'white' }}>
          Loan Details: {selectedLoan?.loanNumber}
        </DialogTitle>
        <DialogContent dividers>
          {selectedLoan && <LoanDetails loan={selectedLoan} />}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDetailDialogOpen(false)}
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ActiveLoansTab;