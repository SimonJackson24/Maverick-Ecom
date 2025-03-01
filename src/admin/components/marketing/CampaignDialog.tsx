import React from 'react';
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
  FormHelperText,
  Box,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useMutation } from '@apollo/client';
import {
  CREATE_CAMPAIGN,
  UPDATE_CAMPAIGN,
  GET_EMAIL_CAMPAIGNS,
} from '../../../graphql/queries/marketing';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import RichTextEditor from '../../components/common/RichTextEditor';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  subject: yup.string().required('Subject is required'),
  content: yup.string().required('Content is required'),
  scheduledDate: yup.date().nullable(),
  segments: yup.array().of(yup.string()).min(1, 'At least one segment is required'),
});

interface CampaignDialogProps {
  open: boolean;
  onClose: () => void;
  campaign?: any;
}

const CampaignDialog: React.FC<CampaignDialogProps> = ({ open, onClose, campaign }) => {
  const [createCampaign] = useMutation(CREATE_CAMPAIGN, {
    refetchQueries: [{ query: GET_EMAIL_CAMPAIGNS }],
  });

  const [updateCampaign] = useMutation(UPDATE_CAMPAIGN, {
    refetchQueries: [{ query: GET_EMAIL_CAMPAIGNS }],
  });

  const formik = useFormik({
    initialValues: {
      name: campaign?.name || '',
      subject: campaign?.subject || '',
      content: campaign?.content || '',
      scheduledDate: campaign?.scheduledDate ? new Date(campaign.scheduledDate) : null,
      segments: campaign?.segments || [],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (campaign) {
          await updateCampaign({
            variables: {
              id: campaign.id,
              input: values,
            },
          });
        } else {
          await createCampaign({
            variables: {
              input: values,
            },
          });
        }
        onClose();
      } catch (error) {
        console.error('Error saving campaign:', error);
      }
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>
          {campaign ? 'Edit Email Campaign' : 'Create Email Campaign'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="name"
                  label="Campaign Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="subject"
                  label="Email Subject"
                  value={formik.values.subject}
                  onChange={formik.handleChange}
                  error={formik.touched.subject && Boolean(formik.errors.subject)}
                  helperText={formik.touched.subject && formik.errors.subject}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="segments-label">Customer Segments</InputLabel>
                  <Select
                    labelId="segments-label"
                    multiple
                    name="segments"
                    value={formik.values.segments}
                    onChange={formik.handleChange}
                    error={formik.touched.segments && Boolean(formik.errors.segments)}
                  >
                    <MenuItem value="all">All Customers</MenuItem>
                    <MenuItem value="active">Active Customers</MenuItem>
                    <MenuItem value="inactive">Inactive Customers</MenuItem>
                    <MenuItem value="vip">VIP Customers</MenuItem>
                  </Select>
                  {formik.touched.segments && formik.errors.segments && (
                    <FormHelperText error>{formik.errors.segments}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <DateTimePicker
                  label="Schedule Date"
                  value={formik.values.scheduledDate}
                  onChange={(value) => formik.setFieldValue('scheduledDate', value)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: formik.touched.scheduledDate && Boolean(formik.errors.scheduledDate),
                      helperText: formik.touched.scheduledDate && formik.errors.scheduledDate,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <RichTextEditor
                  value={formik.values.content}
                  onChange={(value) => formik.setFieldValue('content', value)}
                  error={formik.touched.content && Boolean(formik.errors.content)}
                  helperText={formik.touched.content && formik.errors.content as string}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {campaign ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CampaignDialog;
