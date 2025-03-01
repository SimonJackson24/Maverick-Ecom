import React from 'react';
import {
  Card,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  TextField,
} from '@mui/material';
import {
  FileDownload,
  Schedule,
  Settings,
  History,
  CalendarToday,
  TableChart,
  Close,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export type ExportFormat = 'csv' | 'excel' | 'pdf' | 'json';
export type ExportFrequency = 'once' | 'daily' | 'weekly' | 'monthly';

interface ExportJob {
  id: string;
  name: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress?: number;
  format: ExportFormat;
  createdAt: Date;
  completedAt?: Date;
  downloadUrl?: string;
  error?: string;
}

interface ExportConfig {
  format: ExportFormat;
  dateRange: {
    start: Date;
    end: Date;
  };
  frequency: ExportFrequency;
  includeFields: string[];
  filters?: Record<string, any>;
}

interface DataExportToolsProps {
  availableFields: string[];
  recentJobs: ExportJob[];
  loading?: boolean;
  error?: Error | null;
  onExport: (config: ExportConfig) => Promise<void>;
  onDownload?: (job: ExportJob) => void;
  onCancel?: (job: ExportJob) => void;
}

const DataExportTools: React.FC<DataExportToolsProps> = ({
  availableFields,
  recentJobs,
  loading = false,
  error = null,
  onExport,
  onDownload,
  onCancel,
}) => {
  const [exportDialogOpen, setExportDialogOpen] = React.useState(false);
  const [exportConfig, setExportConfig] = React.useState<ExportConfig>({
    format: 'csv',
    dateRange: {
      start: new Date(),
      end: new Date(),
    },
    frequency: 'once',
    includeFields: [...availableFields],
  });

  const handleExport = async () => {
    await onExport(exportConfig);
    setExportDialogOpen(false);
  };

  const handleFieldToggle = (field: string) => {
    setExportConfig((prev) => ({
      ...prev,
      includeFields: prev.includeFields.includes(field)
        ? prev.includeFields.filter((f) => f !== field)
        : [...prev.includeFields, field],
    }));
  };

  if (loading) {
    return (
      <Card sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Data Export
          </Typography>
          <LinearProgress />
        </Box>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ p: 3 }}>
        <Typography color="error" gutterBottom>
          Error loading export tools
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error.message}
        </Typography>
      </Card>
    );
  }

  return (
    <Card sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Data Export</Typography>
        <Button
          variant="contained"
          startIcon={<FileDownload />}
          onClick={() => setExportDialogOpen(true)}
        >
          New Export
        </Button>
      </Box>

      {recentJobs.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Recent Exports
          </Typography>
          {recentJobs.map((job) => (
            <Box
              key={job.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                mb: 1,
                bgcolor: 'background.default',
                borderRadius: 1,
              }}
            >
              <Box>
                <Typography variant="body2">{job.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {job.createdAt.toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  size="small"
                  label={job.status}
                  color={
                    job.status === 'completed'
                      ? 'success'
                      : job.status === 'failed'
                      ? 'error'
                      : 'warning'
                  }
                />
                {job.status === 'processing' && (
                  <Box sx={{ width: 100 }}>
                    <LinearProgress
                      variant="determinate"
                      value={job.progress || 0}
                      sx={{ height: 4, borderRadius: 2 }}
                    />
                  </Box>
                )}
                {job.status === 'completed' && job.downloadUrl && (
                  <Tooltip title="Download">
                    <IconButton
                      size="small"
                      onClick={() => onDownload && onDownload(job)}
                    >
                      <FileDownload />
                    </IconButton>
                  </Tooltip>
                )}
                {(job.status === 'queued' || job.status === 'processing') && (
                  <Tooltip title="Cancel">
                    <IconButton
                      size="small"
                      onClick={() => onCancel && onCancel(job)}
                    >
                      <Close />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      )}

      <Dialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Configure Export</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Export Format
            </Typography>
            <RadioGroup
              row
              value={exportConfig.format}
              onChange={(e) =>
                setExportConfig((prev) => ({
                  ...prev,
                  format: e.target.value as ExportFormat,
                }))
              }
            >
              <FormControlLabel value="csv" control={<Radio />} label="CSV" />
              <FormControlLabel value="excel" control={<Radio />} label="Excel" />
              <FormControlLabel value="pdf" control={<Radio />} label="PDF" />
              <FormControlLabel value="json" control={<Radio />} label="JSON" />
            </RadioGroup>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Date Range
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={exportConfig.dateRange.start}
                  onChange={(date) =>
                    setExportConfig((prev) => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, start: date || new Date() },
                    }))
                  }
                />
                <DatePicker
                  label="End Date"
                  value={exportConfig.dateRange.end}
                  onChange={(date) =>
                    setExportConfig((prev) => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, end: date || new Date() },
                    }))
                  }
                />
              </LocalizationProvider>
            </Box>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Schedule
            </Typography>
            <RadioGroup
              value={exportConfig.frequency}
              onChange={(e) =>
                setExportConfig((prev) => ({
                  ...prev,
                  frequency: e.target.value as ExportFrequency,
                }))
              }
            >
              <FormControlLabel value="once" control={<Radio />} label="One-time export" />
              <FormControlLabel value="daily" control={<Radio />} label="Daily" />
              <FormControlLabel value="weekly" control={<Radio />} label="Weekly" />
              <FormControlLabel value="monthly" control={<Radio />} label="Monthly" />
            </RadioGroup>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Fields to Include
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {availableFields.map((field) => (
                <Chip
                  key={field}
                  label={field}
                  onClick={() => handleFieldToggle(field)}
                  color={exportConfig.includeFields.includes(field) ? 'primary' : 'default'}
                  variant={exportConfig.includeFields.includes(field) ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleExport}
            startIcon={<FileDownload />}
          >
            Export
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default DataExportTools;
