import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Stack,
  Divider,
} from '@mui/material';
import { InventorySettings } from '../../types/inventory';

interface InventorySettingsFormProps {
  settings: InventorySettings;
  onSave: (settings: InventorySettings) => void;
}

const InventorySettingsForm: React.FC<InventorySettingsFormProps> = ({
  settings,
  onSave,
}) => {
  const [formData, setFormData] = useState<InventorySettings>(settings);

  const handleChange = (field: keyof InventorySettings) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : Number(event.target.value);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader title="Inventory Settings" />
        <CardContent>
          <Stack spacing={3}>
            <TextField
              label="Low Stock Threshold"
              type="number"
              value={formData.lowStockThreshold}
              onChange={handleChange('lowStockThreshold')}
              fullWidth
              helperText="Trigger low stock alert when inventory falls below this number"
            />

            <TextField
              label="Out of Stock Threshold"
              type="number"
              value={formData.outOfStockThreshold}
              onChange={handleChange('outOfStockThreshold')}
              fullWidth
              helperText="Consider product out of stock at this number"
            />

            <Divider />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.enableAutoReorder}
                  onChange={handleChange('enableAutoReorder')}
                />
              }
              label="Enable Auto Reorder"
            />

            {formData.enableAutoReorder && (
              <TextField
                label="Auto Reorder Threshold"
                type="number"
                value={formData.autoReorderThreshold}
                onChange={handleChange('autoReorderThreshold')}
                fullWidth
                helperText="Automatically create purchase order when stock falls below this number"
              />
            )}

            <Divider />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.notifyAdminsOnLowStock}
                  onChange={handleChange('notifyAdminsOnLowStock')}
                />
              }
              label="Notify Administrators on Low Stock"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.notifySupplierOnLowStock}
                  onChange={handleChange('notifySupplierOnLowStock')}
                />
              }
              label="Notify Suppliers on Low Stock"
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
            >
              Save Settings
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </form>
  );
};

export default InventorySettingsForm;
