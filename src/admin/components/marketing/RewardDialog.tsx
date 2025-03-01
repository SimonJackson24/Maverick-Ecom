import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useMutation } from '@apollo/client';
import { CREATE_REWARD, UPDATE_REWARD, GET_LOYALTY_PROGRAM } from '../../../graphql/queries/marketing';

interface RewardDialogProps {
  open: boolean;
  onClose: () => void;
  reward?: any;
}

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  pointsCost: yup.number().required('Points cost is required').min(1, 'Points cost must be positive'),
  type: yup.string().required('Type is required'),
  value: yup.number().required('Value is required').min(0, 'Value must be positive'),
});

const RewardDialog: React.FC<RewardDialogProps> = ({ open, onClose, reward }) => {
  const [createReward] = useMutation(CREATE_REWARD, {
    refetchQueries: [{ query: GET_LOYALTY_PROGRAM }],
  });

  const [updateReward] = useMutation(UPDATE_REWARD, {
    refetchQueries: [{ query: GET_LOYALTY_PROGRAM }],
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      pointsCost: 0,
      type: 'discount_percentage',
      value: 0,
      isActive: true,
      maxRedemptions: null,
      expiryDays: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (reward) {
          await updateReward({
            variables: {
              id: reward.id,
              input: values,
            },
          });
        } else {
          await createReward({
            variables: {
              input: values,
            },
          });
        }
        onClose();
      } catch (error) {
        console.error('Error saving reward:', error);
      }
    },
  });

  useEffect(() => {
    if (reward) {
      formik.setValues({
        name: reward.name,
        description: reward.description,
        pointsCost: reward.pointsCost,
        type: reward.type,
        value: reward.value,
        isActive: reward.isActive,
        maxRedemptions: reward.maxRedemptions,
        expiryDays: reward.expiryDays,
      });
    } else {
      formik.resetForm();
    }
  }, [reward]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>{reward ? 'Edit Reward' : 'Create Reward'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="name"
                label="Reward Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="description"
                label="Description"
                multiline
                rows={3}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="pointsCost"
                label="Points Cost"
                type="number"
                value={formik.values.pointsCost}
                onChange={formik.handleChange}
                error={formik.touched.pointsCost && Boolean(formik.errors.pointsCost)}
                helperText={formik.touched.pointsCost && formik.errors.pointsCost}
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
                  <MenuItem value="discount_percentage">Percentage Discount</MenuItem>
                  <MenuItem value="discount_fixed">Fixed Amount Discount</MenuItem>
                  <MenuItem value="free_shipping">Free Shipping</MenuItem>
                  <MenuItem value="free_product">Free Product</MenuItem>
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
                name="maxRedemptions"
                label="Max Redemptions (Optional)"
                type="number"
                value={formik.values.maxRedemptions}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="expiryDays"
                label="Expiry Days (Optional)"
                type="number"
                value={formik.values.expiryDays}
                onChange={formik.handleChange}
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
            {reward ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RewardDialog;
