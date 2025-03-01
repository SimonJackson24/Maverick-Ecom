import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { useQuery, useMutation } from '@apollo/client';
import { GET_COUPONS, DELETE_COUPON } from '../../../graphql/queries/marketing';
import CouponDialog from '../../components/marketing/CouponDialog';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatDate } from '../../../utils/dateUtils';

const CouponManagementPage: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const { loading, error, data } = useQuery(GET_COUPONS);
  const [deleteCoupon] = useMutation(DELETE_COUPON, {
    refetchQueries: [{ query: GET_COUPONS }],
  });

  const handleAddCoupon = () => {
    setSelectedCoupon(null);
    setOpenDialog(true);
  };

  const handleEditCoupon = (coupon: any) => {
    setSelectedCoupon(coupon);
    setOpenDialog(true);
  };

  const handleDeleteCoupon = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await deleteCoupon({ variables: { id } });
      } catch (error) {
        console.error('Error deleting coupon:', error);
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error loading coupons: {error.message}</div>;

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Coupon Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddCoupon}
        >
          Create Coupon
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Code</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Value</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Usage</TableCell>
                      <TableCell>Expiry</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.coupons.map((coupon: any) => (
                      <TableRow key={coupon.id}>
                        <TableCell>{coupon.code}</TableCell>
                        <TableCell>{coupon.type}</TableCell>
                        <TableCell>
                          {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={coupon.isActive ? 'Active' : 'Inactive'}
                            color={coupon.isActive ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{`${coupon.usageCount}/${coupon.maxUses || '∞'}`}</TableCell>
                        <TableCell>{coupon.expiryDate ? formatDate(coupon.expiryDate) : 'Never'}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleEditCoupon(coupon)} size="small">
                            <Edit />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteCoupon(coupon.id)} size="small" color="error">
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <CouponDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        coupon={selectedCoupon}
      />
    </Box>
  );
};

export default CouponManagementPage;
