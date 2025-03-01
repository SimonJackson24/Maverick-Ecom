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
import { Edit, Delete, Add, Send } from '@mui/icons-material';
import { useQuery, useMutation } from '@apollo/client';
import { GET_EMAIL_CAMPAIGNS, DELETE_CAMPAIGN } from '../../../graphql/queries/marketing';
import CampaignDialog from '../../components/marketing/CampaignDialog';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatDate } from '../../../utils/dateUtils';

const EmailCampaignPage: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const { loading, error, data } = useQuery(GET_EMAIL_CAMPAIGNS);
  const [deleteCampaign] = useMutation(DELETE_CAMPAIGN, {
    refetchQueries: [{ query: GET_EMAIL_CAMPAIGNS }],
  });

  const handleAddCampaign = () => {
    setSelectedCampaign(null);
    setOpenDialog(true);
  };

  const handleEditCampaign = (campaign: any) => {
    setSelectedCampaign(campaign);
    setOpenDialog(true);
  };

  const handleDeleteCampaign = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await deleteCampaign({ variables: { id } });
      } catch (error) {
        console.error('Error deleting campaign:', error);
      }
    }
  };

  const getCampaignStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return 'default';
      case 'scheduled':
        return 'info';
      case 'sending':
        return 'warning';
      case 'sent':
        return 'success';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error loading campaigns: {error.message}</div>;

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Email Campaigns</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddCampaign}
        >
          Create Campaign
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
                      <TableCell>Name</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Recipients</TableCell>
                      <TableCell>Scheduled Date</TableCell>
                      <TableCell>Open Rate</TableCell>
                      <TableCell>Click Rate</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.emailCampaigns.map((campaign: any) => (
                      <TableRow key={campaign.id}>
                        <TableCell>{campaign.name}</TableCell>
                        <TableCell>{campaign.subject}</TableCell>
                        <TableCell>
                          <Chip
                            label={campaign.status}
                            color={getCampaignStatusColor(campaign.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{campaign.recipientCount}</TableCell>
                        <TableCell>
                          {campaign.scheduledDate ? formatDate(campaign.scheduledDate) : 'Not scheduled'}
                        </TableCell>
                        <TableCell>
                          {campaign.status === 'sent' ? `${campaign.openRate}%` : '-'}
                        </TableCell>
                        <TableCell>
                          {campaign.status === 'sent' ? `${campaign.clickRate}%` : '-'}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleEditCampaign(campaign)}
                            size="small"
                            disabled={campaign.status === 'sent'}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteCampaign(campaign.id)}
                            size="small"
                            color="error"
                            disabled={campaign.status === 'sent' || campaign.status === 'sending'}
                          >
                            <Delete />
                          </IconButton>
                          {campaign.status === 'draft' && (
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => {/* TODO: Implement send now */}}
                            >
                              <Send />
                            </IconButton>
                          )}
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

      <CampaignDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        campaign={selectedCampaign}
      />
    </Box>
  );
};

export default EmailCampaignPage;
