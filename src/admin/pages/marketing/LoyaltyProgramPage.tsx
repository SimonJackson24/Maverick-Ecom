import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Switch,
} from '@mui/material';
import { Edit, Add } from '@mui/icons-material';
import { useQuery, useMutation } from '@apollo/client';
import { GET_LOYALTY_PROGRAM, UPDATE_LOYALTY_SETTINGS } from '../../../graphql/queries/marketing';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import RewardDialog from '../../components/marketing/RewardDialog';
import TierDialog from '../../components/marketing/TierDialog';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`loyalty-tabpanel-${index}`}
      aria-labelledby={`loyalty-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const LoyaltyProgramPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openRewardDialog, setOpenRewardDialog] = useState(false);
  const [openTierDialog, setOpenTierDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const { loading, error, data } = useQuery(GET_LOYALTY_PROGRAM);
  const [updateSettings] = useMutation(UPDATE_LOYALTY_SETTINGS);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleToggleLoyalty = async () => {
    try {
      await updateSettings({
        variables: {
          input: {
            isEnabled: !data.loyaltyProgram.isEnabled,
          },
        },
      });
    } catch (error) {
      console.error('Error updating loyalty program:', error);
    }
  };

  const handleAddReward = () => {
    setSelectedItem(null);
    setOpenRewardDialog(true);
  };

  const handleEditReward = (reward: any) => {
    setSelectedItem(reward);
    setOpenRewardDialog(true);
  };

  const handleAddTier = () => {
    setSelectedItem(null);
    setOpenTierDialog(true);
  };

  const handleEditTier = (tier: any) => {
    setSelectedItem(tier);
    setOpenTierDialog(true);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error loading loyalty program: {error.message}</div>;

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Loyalty Program</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography>Program Status</Typography>
          <Switch
            checked={data.loyaltyProgram.isEnabled}
            onChange={handleToggleLoyalty}
            color="primary"
          />
        </Box>
      </Box>

      <Card>
        <CardContent>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Rewards" />
            <Tab label="Tiers" />
            <Tab label="Settings" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={handleAddReward}
              >
                Add Reward
              </Button>
            </Box>
            <List>
              {data.loyaltyProgram.rewards.map((reward: any) => (
                <ListItem key={reward.id}>
                  <ListItemText
                    primary={reward.name}
                    secondary={`${reward.pointsCost} points - ${reward.description}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => handleEditReward(reward)}>
                      <Edit />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={handleAddTier}
              >
                Add Tier
              </Button>
            </Box>
            <List>
              {data.loyaltyProgram.tiers.map((tier: any) => (
                <ListItem key={tier.id}>
                  <ListItemText
                    primary={tier.name}
                    secondary={`Required Points: ${tier.requiredPoints} - Benefits: ${tier.benefits.join(', ')}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => handleEditTier(tier)}>
                      <Edit />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Point Earning Rules
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Points per Dollar"
                          secondary={`${data.loyaltyProgram.settings.pointsPerDollar} points`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Minimum Purchase"
                          secondary={`$${data.loyaltyProgram.settings.minimumPurchase}`}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Point Expiration
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Points Validity"
                          secondary={`${data.loyaltyProgram.settings.pointsValidity} months`}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </CardContent>
      </Card>

      <RewardDialog
        open={openRewardDialog}
        onClose={() => setOpenRewardDialog(false)}
        reward={selectedItem}
      />

      <TierDialog
        open={openTierDialog}
        onClose={() => setOpenTierDialog(false)}
        tier={selectedItem}
      />
    </Box>
  );
};

export default LoyaltyProgramPage;
