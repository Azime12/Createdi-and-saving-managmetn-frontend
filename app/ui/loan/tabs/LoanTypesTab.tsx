import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '@mui/material/styles';
import { toast } from 'react-toastify';
import { 
  useGetAllLoanTypesQuery,
  useCreateLoanTypeMutation,
  useUpdateLoanTypeMutation,
  useDeleteLoanTypeMutation,
} from '../../features/api/loanTypeApiSlice';

const LoanTypesTab = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentLoanType, setCurrentLoanType] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: loanTypes,
    isLoading,
    isError,
    error,
  } = useGetAllLoanTypesQuery({
    search: searchTerm,
    page: page + 1,
    limit: rowsPerPage,
  });

  const [createLoanType] = useCreateLoanTypeMutation();
  const [updateLoanType] = useUpdateLoanTypeMutation();
  const [deleteLoanType] = useDeleteLoanTypeMutation();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenEditDialog = (loanType = null) => {
    setCurrentLoanType(loanType || {
      name: '',
      description: '',
      interest_rate: '',
      min_term: '',
      max_term: '',
      payment_frequency: 'monthly',
      min_amount: '',
      max_amount: '',
      is_active: true,
    });
    setIsEditing(!!loanType);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setCurrentLoanType(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLoanType({
      ...currentLoanType,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await updateLoanType({
          id: currentLoanType.id,
          ...currentLoanType,
        }).unwrap();
        toast.success('Loan type updated successfully');
      } else {
        await createLoanType(currentLoanType).unwrap();
        toast.success('Loan type created successfully');
      }
      handleCloseEditDialog();
    } catch (err) {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} loan type: ${err.data?.message || err.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteLoanType(id).unwrap();
      toast.success('Loan type deleted successfully');
    } catch (err) {
      toast.error(`Failed to delete loan type: ${err.data?.message || err.message}`);
    }
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
      <Card sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Search Loan Types"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name..."
            />
          </Grid>
          <Grid item xs={12} md={4} textAlign="right">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenEditDialog()}
            >
              Add Loan Type
            </Button>
          </Grid>
        </Grid>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Interest Rate</TableCell>
              <TableCell>Term Range</TableCell>
              <TableCell>Amount Range</TableCell>
              <TableCell>Payment Frequency</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loanTypes?.data?.map((loanType) => (
              <TableRow key={loanType.id}>
                <TableCell>
                  <Typography fontWeight="bold">{loanType.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {loanType.description || 'No description'}
                  </Typography>
                </TableCell>
                <TableCell>{loanType.interest_rate}%</TableCell>
                <TableCell>
                  {loanType.min_term} - {loanType.max_term} months
                </TableCell>
                <TableCell>
                  {parseFloat(loanType.min_amount).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}{' '}
                  -{' '}
                  {parseFloat(loanType.max_amount).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </TableCell>
                <TableCell>
                  {loanType.payment_frequency.charAt(0).toUpperCase() +
                    loanType.payment_frequency.slice(1)}
                </TableCell>
                <TableCell>
                  <Chip
                    label={loanType.is_active ? 'Active' : 'Inactive'}
                    color={loanType.is_active ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenEditDialog(loanType)}
                  >
                    <EditIcon />
                  </IconButton>
                  <Button
                    color="error"
                    onClick={() => handleDelete(loanType.id)}
                    size="small"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={loanTypes?.pagination?.total || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Edit/Create Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isEditing ? 'Edit Loan Type' : 'Create New Loan Type'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={currentLoanType?.name || ''}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={currentLoanType?.description || ''}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Interest Rate (%)"
                  name="interest_rate"
                  type="number"
                  value={currentLoanType?.interest_rate || ''}
                  onChange={handleInputChange}
                  required
                  inputProps={{ step: '0.01', min: '0' }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Payment Frequency"
                  name="payment_frequency"
                  select
                  value={currentLoanType?.payment_frequency || 'monthly'}
                  onChange={handleInputChange}
                  required
                >
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="biweekly">Biweekly</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Minimum Term (months)"
                  name="min_term"
                  type="number"
                  value={currentLoanType?.min_term || ''}
                  onChange={handleInputChange}
                  required
                  inputProps={{ min: '1' }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Maximum Term (months)"
                  name="max_term"
                  type="number"
                  value={currentLoanType?.max_term || ''}
                  onChange={handleInputChange}
                  required
                  inputProps={{ min: '1' }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Minimum Amount"
                  name="min_amount"
                  type="number"
                  value={currentLoanType?.min_amount || ''}
                  onChange={handleInputChange}
                  required
                  inputProps={{ step: '0.01', min: '0' }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Maximum Amount"
                  name="max_amount"
                  type="number"
                  value={currentLoanType?.max_amount || ''}
                  onChange={handleInputChange}
                  required
                  inputProps={{ step: '0.01', min: '0' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Status"
                  name="is_active"
                  select
                  value={currentLoanType?.is_active || true}
                  onChange={(e) =>
                    handleInputChange({
                      target: {
                        name: 'is_active',
                        value: e.target.value === 'true',
                      },
                    })
                  }
                  required
                >
                  <MenuItem value={true}>Active</MenuItem>
                  <MenuItem value={false}>Inactive</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoanTypesTab;