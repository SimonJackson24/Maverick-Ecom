import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Chip,
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useMutation } from '@apollo/client';
import { CREATE_TIER, UPDATE_TIER, GET_LOYALTY_PROGRAM } from '../../../graphql/queries/marketing';

interface TierDialogProps {
  open: boolean;
  onClose: () => void;
  tier?: any;
}

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  requiredPoints: yup.number().required('Required points is required').min(0, 'Required points must be positive'),
  benefits: yup.array().min(1, 'At least one benefit is required'),
  multiplier: yup.number().required('Point multiplier is required').min(1, 'Multiplier must be at least 1'),
});

const TierDialog: React.FC<TierDialogProps> = ({ open, onClose, tier }) => {
  const [createTier] = useMutation(CREATE_TIER, {
    refetchQueries: [{ query: GET_LOYALTY_PROGRAM }],
  });

  const [updateTier] = useMutation(UPDATE_TIER, {
    refetchQueries: [{ query: GET_LOYALTY_PROGRAM }],
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      requiredPoints: 0,
      benefits: [],
      multiplier: 1,
      color: '#000000',
      newBenefit: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const { newBenefit, ...submitValues } = values;
      try {
        if (tier) {
          await updateTier({
            variables: {
              id: tier.id,
              input: submitValues,
            },
          });
        } else {
          await createTier({
            variables: {
              input: submitValues,
            },
          });
        }
        onClose();
      } catch (error) {
        console.error('Error saving tier:', error);
      }
    },
  });

  useEffect(() => {
    if (tier) {
      formik.setValues({
        ...tier,
        newBenefit: '',
      });
    } else {
      formik.resetForm();
    }
  }, [tier]);

  const handleAddBenefit = () => {
    if (formik.values.newBenefit.trim()) {
      formik.setFieldValue('benefits', [...formik.values.benefits, formik.values.newBenefit.trim()]);
      formik.setFieldValue('newBenefit', '');
    }
  };

  const handleRemoveBenefit = (index: number) => {
    const newBenefits = [...formik.values.benefits];
    newBenefits.splice(index, 1);
    formik.setFieldValue('benefits', newBenefits);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>{tier ? 'Edit Tier' : 'Create Tier'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="name"
                label="Tier Name"
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
                name="requiredPoints"
                label="Required Points"
                type="number"
                value={formik.values.requiredPoints}
                onChange={formik.handleChange}
                error={formik.touched.requiredPoints && Boolean(formik.errors.requiredPoints)}
                helperText={formik.touched.requiredPoints && formik.errors.requiredPoints}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="multiplier"
                label="Point Multiplier"
                type="number"
                value={formik.values.multiplier}
                onChange={formik.handleChange}
                error={formik.touched.multiplier && Boolean(formik.errors.multiplier)}
                helperText={formik.touched.multiplier && formik.errors.multiplier}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="color"
                label="Tier Color"
                type="color"
                value={formik.values.color}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Benefits
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  name="newBenefit"
                  label="Add Benefit"
                  value={formik.values.newBenefit}
                  onChange={formik.handleChange}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddBenefit();
                    }
                  }}
                />
                <IconButton onClick={handleAddBenefit} color="primary">
                  <AddIcon />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formik.values.benefits.map((benefit: string, index: number) => (
                  <Chip
                    key={index}
                    label={benefit}
                    onDelete={() => handleRemoveBenefit(index)}
                    deleteIcon={<DeleteIcon />}
                  />
                ))}
              </Box>
              {formik.touched.benefits && formik.errors.benefits && (
                <Typography color="error" variant="caption">
                  {formik.errors.benefits}
                </Typography>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {tier ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TierDialog;
