import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Link as LinkIcon,
} from '@mui/icons-material';

interface UrlData {
  id: string;
  currentUrl: string;
  targetUrl: string;
  type: 'redirect' | 'canonical' | 'alternate';
  status: number;
  lastChecked: string;
}

interface UrlManagerProps {
  data: UrlData[];
}

const UrlManager: React.FC<UrlManagerProps> = ({ data = [] }) => {
  const [open, setOpen] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<UrlData | null>(null);

  const handleEdit = (url: UrlData) => {
    setSelectedUrl(url);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUrl(null);
  };

  const handleSave = () => {
    // Implement save logic here
    handleClose();
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'success';
    if (status >= 300 && status < 400) return 'warning';
    return 'error';
  };

  return (
    <>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              URL Management
            </Typography>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              onClick={() => handleEdit({
                id: '',
                currentUrl: '',
                targetUrl: '',
                type: 'redirect',
                status: 200,
                lastChecked: new Date().toISOString(),
              })}
            >
              Add URL Rule
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Current URL</TableCell>
                  <TableCell>Target URL</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Checked</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((url) => (
                  <TableRow key={url.id}>
                    <TableCell>{url.currentUrl}</TableCell>
                    <TableCell>{url.targetUrl}</TableCell>
                    <TableCell>
                      <Chip
                        label={url.type}
                        size="small"
                        color={
                          url.type === 'redirect'
                            ? 'primary'
                            : url.type === 'canonical'
                            ? 'secondary'
                            : 'default'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={url.status}
                        size="small"
                        color={getStatusColor(url.status)}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(url.lastChecked).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleEdit(url)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedUrl?.id ? 'Edit URL Rule' : 'Add URL Rule'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Current URL"
              fullWidth
              value={selectedUrl?.currentUrl || ''}
              onChange={(e) =>
                setSelectedUrl((prev) =>
                  prev ? { ...prev, currentUrl: e.target.value } : null
                )
              }
            />
            <TextField
              label="Target URL"
              fullWidth
              value={selectedUrl?.targetUrl || ''}
              onChange={(e) =>
                setSelectedUrl((prev) =>
                  prev ? { ...prev, targetUrl: e.target.value } : null
                )
              }
            />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={selectedUrl?.type || 'redirect'}
                label="Type"
                onChange={(e) =>
                  setSelectedUrl((prev) =>
                    prev
                      ? { ...prev, type: e.target.value as UrlData['type'] }
                      : null
                  )
                }
              >
                <MenuItem value="redirect">Redirect</MenuItem>
                <MenuItem value="canonical">Canonical</MenuItem>
                <MenuItem value="alternate">Alternate</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UrlManager;
