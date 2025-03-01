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
  Box,
  Chip,
  LinearProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useMutation } from '@apollo/client';
import { ADD_KEYWORD, UPDATE_KEYWORD, DELETE_KEYWORD } from '../../../graphql/mutations/seo';
import { GET_SEO_METRICS } from '../../../graphql/queries/seo';

interface KeywordData {
  id: string;
  keyword: string;
  position: number;
  trend: number;
  volume: number;
  difficulty: number;
  relevance: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  location: string;
}

interface KeywordPerformanceProps {
  data: KeywordData[];
  fullWidth?: boolean;
}

const KeywordPerformance: React.FC<KeywordPerformanceProps> = ({ data = [], fullWidth = false }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingKeyword, setEditingKeyword] = useState<KeywordData | null>(null);
  const [formData, setFormData] = useState({
    term: '',
    priority: 'MEDIUM' as 'HIGH' | 'MEDIUM' | 'LOW',
    location: 'United Kingdom'
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const [addKeyword] = useMutation(ADD_KEYWORD, {
    refetchQueries: [{ query: GET_SEO_METRICS }],
    onCompleted: () => {
      setSnackbar({ open: true, message: 'Keyword added successfully', severity: 'success' });
      handleCloseDialog();
    },
    onError: (error) => {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    }
  });

  const [updateKeyword] = useMutation(UPDATE_KEYWORD, {
    refetchQueries: [{ query: GET_SEO_METRICS }],
    onCompleted: () => {
      setSnackbar({ open: true, message: 'Keyword updated successfully', severity: 'success' });
      handleCloseDialog();
    },
    onError: (error) => {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    }
  });

  const [deleteKeyword] = useMutation(DELETE_KEYWORD, {
    refetchQueries: [{ query: GET_SEO_METRICS }],
    onCompleted: () => {
      setSnackbar({ open: true, message: 'Keyword deleted successfully', severity: 'success' });
    },
    onError: (error) => {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    }
  });

  const handleOpenDialog = (keyword?: KeywordData) => {
    if (keyword) {
      setEditingKeyword(keyword);
      setFormData({
        term: keyword.keyword,
        priority: keyword.priority,
        location: keyword.location
      });
    } else {
      setEditingKeyword(null);
      setFormData({
        term: '',
        priority: 'MEDIUM',
        location: 'United Kingdom'
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingKeyword(null);
    setFormData({
      term: '',
      priority: 'MEDIUM',
      location: 'United Kingdom'
    });
  };

  const handleSubmit = async () => {
    if (editingKeyword) {
      await updateKeyword({
        variables: {
          id: editingKeyword.id,
          input: formData
        }
      });
    } else {
      await addKeyword({
        variables: {
          input: formData
        }
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this keyword?')) {
      await deleteKeyword({
        variables: { id }
      });
    }
  };

  return (
    <>
      <Card sx={{ height: '100%', ...(fullWidth && { width: '100%' }) }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Keyword Performance</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add Keyword
            </Button>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Keyword</TableCell>
                  <TableCell align="right">Position</TableCell>
                  <TableCell align="right">Trend</TableCell>
                  <TableCell align="right">Volume</TableCell>
                  <TableCell>Difficulty</TableCell>
                  <TableCell>Relevance</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.keyword}
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`#${row.position}`}
                        color={row.position <= 10 ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        {row.trend > 0 ? (
                          <TrendingUp color="success" fontSize="small" />
                        ) : (
                          <TrendingDown color="error" fontSize="small" />
                        )}
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {Math.abs(row.trend)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">{row.volume}</TableCell>
                    <TableCell>
                      <Box sx={{ width: '100%' }}>
                        <LinearProgress
                          variant="determinate"
                          value={row.difficulty}
                          sx={{
                            height: 8,
                            borderRadius: 5,
                            backgroundColor: (theme) => theme.palette.grey[200],
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 5,
                              backgroundColor: (theme) =>
                                row.difficulty <= 33
                                  ? theme.palette.success.main
                                  : row.difficulty <= 66
                                  ? theme.palette.warning.main
                                  : theme.palette.error.main,
                            },
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${row.relevance}%`}
                        color={
                          row.relevance >= 80
                            ? 'success'
                            : row.relevance >= 50
                            ? 'warning'
                            : 'error'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.priority}
                        color={
                          row.priority === 'HIGH'
                            ? 'error'
                            : row.priority === 'MEDIUM'
                            ? 'warning'
                            : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{row.location}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(row)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(row.id)}
                        color="error"
                      >
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

      {/* Add/Edit Keyword Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingKeyword ? 'Edit Keyword' : 'Add New Keyword'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Keyword"
              value={formData.term}
              onChange={(e) => setFormData({ ...formData, term: e.target.value })}
              fullWidth
              required
            />
            <TextField
              select
              label="Priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'HIGH' | 'MEDIUM' | 'LOW' })}
              fullWidth
              required
            >
              <MenuItem value="HIGH">High</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="LOW">Low</MenuItem>
            </TextField>
            <TextField
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              fullWidth
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={!formData.term.trim()}
          >
            {editingKeyword ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default KeywordPerformance;
