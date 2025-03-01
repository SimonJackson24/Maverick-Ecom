import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Button,
  Box,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
} from '@mui/icons-material';

interface Keyword {
  term: string;
  priority: 'high' | 'medium' | 'low';
  location: string;
  position?: number;
  previousPosition?: number;
  trend?: 'up' | 'down' | 'flat';
}

interface KeywordRankingTableProps {
  keywords: Keyword[];
  onChange: (keywords: Keyword[]) => void;
}

export const KeywordRankingTable: React.FC<KeywordRankingTableProps> = ({
  keywords,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [editingKeyword, setEditingKeyword] = useState<Keyword | null>(null);
  const [newKeyword, setNewKeyword] = useState<Keyword>({
    term: '',
    priority: 'medium',
    location: 'United Kingdom',
  });

  const handleAdd = () => {
    if (newKeyword.term.trim()) {
      const updatedKeywords = [...keywords, { ...newKeyword }];
      onChange(updatedKeywords);
      setNewKeyword({
        term: '',
        priority: 'medium',
        location: 'United Kingdom',
      });
      setOpen(false);
    }
  };

  const handleEdit = (keyword: Keyword) => {
    setEditingKeyword(keyword);
    setNewKeyword(keyword);
    setOpen(true);
  };

  const handleDelete = (keyword: Keyword) => {
    const updatedKeywords = keywords.filter((k) => k.term !== keyword.term);
    onChange(updatedKeywords);
  };

  const handleSave = () => {
    if (editingKeyword) {
      const updatedKeywords = keywords.map((k) =>
        k.term === editingKeyword.term ? newKeyword : k
      );
      onChange(updatedKeywords);
    } else {
      handleAdd();
    }
    setOpen(false);
    setEditingKeyword(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon color="success" />;
      case 'down':
        return <TrendingDownIcon color="error" />;
      case 'flat':
        return <TrendingFlatIcon color="action" />;
      default:
        return null;
    }
  };

  return (
    <>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Keyword Rankings</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setEditingKeyword(null);
            setNewKeyword({
              term: '',
              priority: 'medium',
              location: 'United Kingdom',
            });
            setOpen(true);
          }}
        >
          Add Keyword
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Keyword</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Trend</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {keywords.map((keyword) => (
              <TableRow key={keyword.term}>
                <TableCell>{keyword.term}</TableCell>
                <TableCell>
                  <Chip
                    label={keyword.priority}
                    color={getPriorityColor(keyword.priority)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{keyword.location}</TableCell>
                <TableCell>{keyword.position || 'N/A'}</TableCell>
                <TableCell>{getTrendIcon(keyword.trend)}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleEdit(keyword)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(keyword)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {keywords.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Alert severity="info">No keywords tracked yet. Add your first keyword to start monitoring rankings.</Alert>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {editingKeyword ? 'Edit Keyword' : 'Add New Keyword'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Keyword"
              value={newKeyword.term}
              onChange={(e) =>
                setNewKeyword({ ...newKeyword, term: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={newKeyword.priority}
                label="Priority"
                onChange={(e) =>
                  setNewKeyword({
                    ...newKeyword,
                    priority: e.target.value as 'high' | 'medium' | 'low',
                  })
                }
              >
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Location"
              value={newKeyword.location}
              onChange={(e) =>
                setNewKeyword({ ...newKeyword, location: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {editingKeyword ? 'Save Changes' : 'Add Keyword'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
