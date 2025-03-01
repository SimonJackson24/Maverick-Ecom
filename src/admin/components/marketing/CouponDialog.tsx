import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useMutation } from '@apollo/client';
import { CREATE_COUPON, UPDATE_COUPON, GET_COUPONS } from '../../../graphql/queries/marketing';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface CouponDialogProps {
  open: boolean;
  onClose: () => void;
  coupon?: any;
}

const validationSchema = yup.object({
  code: yup.string().required('Code is required'),
  type: yup.string().required('Type is required'),
  value: yup.number().required('Value is required').min(0, 'Value must be positive'),
  maxUses: yup.number().min(0, 'Max uses must be positive'),
  minPurchaseAmount: yup.number().min(0, 'Minimum purchase amount must be positive'),
});

const CouponDialog: React.FC<CouponDialogProps> = ({ open, onClose, coupon }) => {
  const [createCoupon] = useMutation(CREATE_COUPON, {
    refetchQueries: [{ query: GET_COUPONS }],
  });

  const [updateCoupon] = useMutation(UPDATE_COUPON, {
    refetchQueries: [{ query: GET_COUPONS }],
  });

  const formik = useFormik({
    initialValues: {
      code: '',
      type: 'percentage',
      value: 0,
      maxUses: null,
      minPurchaseAmount: 0,
      isActive: true,
      expiryDate: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (coupon) {
          await updateCoupon({
            variables: {
              id: coupon.id,
              input: values,
            },
          });
        } else {
          await createCoupon({
            variables: {
              input: values,
            },
          });
        }
        onClose();
      } catch (error) {
        console.error('Error saving coupon:', error);
      }
    },
  });

  useEffect(() => {
    if (coupon) {
      formik.setValues({
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        maxUses: coupon.maxUses,
        minPurchaseAmount: coupon.minPurchaseAmount,
        isActive: coupon.isActive,
        expiryDate: coupon.expiryDate,
      });
    } else {
      formik.resetForm();
    }
  }, [coupon]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>{coupon ? 'Edit Coupon' : 'Create Coupon'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="code"
                label="Coupon Code"
                value={formik.values.code}
                onChange={formik.handleChange}
                error={formik.touched.code && Boolean(formik.errors.code)}
                helperText={formik.touched.code && formik.errors.code}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={formik.values.type}
                  onChange={formik.handleChange}
                  label="Type"
                >
                  <MenuItem value="percentage">Percentage</MenuItem>
                  <MenuItem value="fixed">Fixed Amount</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="value"
                label="Value"
                type="number"
                value={formik.values.value}
                onChange={formik.handleChange}
                error={formik.touched.value && Boolean(formik.errors.value)}
                helperText={formik.touched.value && formik.errors.value}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="maxUses"
                label="Max Uses (Optional)"
                type="number"
                value={formik.values.maxUses}
                onChange={formik.handleChange}
                error={formik.touched.maxUses && Boolean(formik.errors.maxUses)}
                helperText={formik.touched.maxUses && formik.errors.maxUses}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="minPurchaseAmount"
                label="Minimum Purchase Amount"
                type="number"
                value={formik.values.minPurchaseAmount}
                onChange={formik.handleChange}
                error={formik.touched.minPurchaseAmount && Boolean(formik.errors.minPurchaseAmount)}
                helperText={formik.touched.minPurchaseAmount && formik.errors.minPurchaseAmount}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Expiry Date (Optional)"
                value={formik.values.expiryDate}
                onChange={(date) => formik.setFieldValue('expiryDate', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.isActive}
                    onChange={(e) => formik.setFieldValue('isActive', e.target.checked)}
                    name="isActive"
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {coupon ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CouponDialog;
