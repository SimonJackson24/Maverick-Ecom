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
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

interface MetaTag {
  id: string;
  url: string;
  title: string;
  description: string;
  keywords: string[];
  status: 'ok' | 'warning' | 'error';
  issues?: string[];
}

interface MetaTagManagerProps {
  data: MetaTag[];
}

const MetaTagManager: React.FC<MetaTagManagerProps> = ({ data = [] }) => {
  const [open, setOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<MetaTag | null>(null);

  const handleEdit = (tag: MetaTag) => {
    setSelectedTag(tag);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTag(null);
  };

  const handleSave = () => {
    // Implement save logic here
    handleClose();
  };

  return (
    <>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Meta Tags
            </Typography>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              onClick={() => handleEdit({ id: '', url: '', title: '', description: '', keywords: [], status: 'ok' })}
            >
              Add Meta Tag
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>URL</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Keywords</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell>{tag.url}</TableCell>
                    <TableCell>{tag.title}</TableCell>
                    <TableCell>{tag.description}</TableCell>
                    <TableCell>
                      {tag.keywords.map((keyword, index) => (
                        <Chip
                          key={index}
                          label={keyword}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </TableCell>
                    <TableCell>
                      {tag.status === 'ok' ? (
                        <Chip
                          icon={<CheckCircleIcon />}
                          label="OK"
                          color="success"
                          size="small"
                        />
                      ) : (
                        <Chip
                          icon={<WarningIcon />}
                          label={tag.status.toUpperCase()}
                          color={tag.status === 'warning' ? 'warning' : 'error'}
                          size="small"
                        />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleEdit(tag)}>
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
        <DialogTitle>{selectedTag?.id ? 'Edit Meta Tag' : 'Add Meta Tag'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="URL"
              fullWidth
              value={selectedTag?.url || ''}
              onChange={(e) => setSelectedTag(prev => prev ? { ...prev, url: e.target.value } : null)}
            />
            <TextField
              label="Title"
              fullWidth
              value={selectedTag?.title || ''}
              onChange={(e) => setSelectedTag(prev => prev ? { ...prev, title: e.target.value } : null)}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={selectedTag?.description || ''}
              onChange={(e) => setSelectedTag(prev => prev ? { ...prev, description: e.target.value } : null)}
            />
            <TextField
              label="Keywords (comma separated)"
              fullWidth
              value={selectedTag?.keywords.join(', ') || ''}
              onChange={(e) => setSelectedTag(prev => prev ? { ...prev, keywords: e.target.value.split(',').map(k => k.trim()) } : null)}
              helperText="Enter keywords separated by commas"
            />
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

export default MetaTagManager;
