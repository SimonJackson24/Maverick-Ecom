import React, { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Reply as ReplyIcon,
} from '@mui/icons-material';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_SUPPORT_TICKETS,
  CREATE_SUPPORT_TICKET,
  UPDATE_TICKET,
  ADD_TICKET_RESPONSE,
} from '../../../graphql/support';
import { Permission } from '../../types/permissions';
import { SupportTicket } from '../../../types/support';
import { useSnackbar } from 'notistack';

interface CreateTicketInput {
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

const CustomerInquiries: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newTicket, setNewTicket] = useState<CreateTicketInput>({
    customerName: '',
    customerEmail: '',
    subject: '',
    description: '',
    priority: 'medium',
    category: 'general',
  });

  const { enqueueSnackbar } = useSnackbar();

  const { loading, error, data, refetch } = useQuery(GET_SUPPORT_TICKETS, {
    variables: {
      filter: {
        status: filterStatus === 'all' ? undefined : filterStatus,
        search: searchQuery || undefined,
      },
    },
  });

  const [createTicket] = useMutation(CREATE_SUPPORT_TICKET, {
    onCompleted: () => {
      enqueueSnackbar('Ticket created successfully', { variant: 'success' });
      setCreateDialogOpen(false);
      refetch();
      setNewTicket({
        customerName: '',
        customerEmail: '',
        subject: '',
        description: '',
        priority: 'medium',
        category: 'general',
      });
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
  });

  const [addResponse] = useMutation(ADD_TICKET_RESPONSE);
  const [updateTicket] = useMutation(UPDATE_TICKET);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleReplyClick = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setReplyDialogOpen(true);
  };

  const handleReplySubmit = async () => {
    if (!selectedTicket || !replyContent) return;

    try {
      await addResponse({
        variables: {
          input: {
            ticketId: selectedTicket.id,
            content: replyContent,
            isInternal: false,
          },
        },
      });

      // Update ticket status if it's open
      if (selectedTicket.status === 'open') {
        await updateTicket({
          variables: {
            id: selectedTicket.id,
            input: {
              status: 'in_progress',
            },
          },
        });
      }

      enqueueSnackbar('Reply sent successfully', { variant: 'success' });
      setReplyDialogOpen(false);
      setReplyContent('');
      setSelectedTicket(null);
      refetch();
    } catch (err) {
      enqueueSnackbar('Failed to send reply', { variant: 'error' });
    }
  };

  const handleCreateTicket = async () => {
    await createTicket({
      variables: {
        input: newTicket,
      },
    });
  };

  const getStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status) {
      case 'open':
        return 'error';
      case 'in_progress':
        return 'warning';
      case 'resolved':
        return 'success';
      case 'closed':
        return 'default';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (priority) {
      case 'urgent':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">Error loading tickets: {error.message}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4">Customer Support Tickets</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
            >
              Create Ticket
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            label="Search tickets"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Status Filter</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as string)}
              label="Status Filter"
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : (
                  (data?.supportTickets || [])
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((ticket: SupportTicket) => (
                      <TableRow key={ticket.id}>
                        <TableCell>
                          {new Date(ticket.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell>{ticket.customerEmail}</TableCell>
                        <TableCell>{ticket.subject}</TableCell>
                        <TableCell>
                          <Chip
                            label={ticket.status.replace('_', ' ').toUpperCase()}
                            color={getStatusColor(ticket.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={ticket.priority.toUpperCase()}
                            color={getPriorityColor(ticket.priority)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleReplyClick(ticket)}
                            title="Reply"
                          >
                            <ReplyIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => {/* TODO: Implement edit */}}
                            title="Edit"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => {/* TODO: Implement delete */}}
                            title="Delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={data?.supportTickets?.length || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Grid>
      </Grid>

      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create Support Ticket</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Customer Name"
                value={newTicket.customerName}
                onChange={(e) => setNewTicket({ ...newTicket, customerName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Customer Email"
                type="email"
                value={newTicket.customerEmail}
                onChange={(e) => setNewTicket({ ...newTicket, customerEmail: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subject"
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={newTicket.description}
                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as 'low' | 'medium' | 'high' })}
                  label="Priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newTicket.category}
                  onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                  label="Category"
                >
                  <MenuItem value="general">General</MenuItem>
                  <MenuItem value="orders">Orders</MenuItem>
                  <MenuItem value="product">Product</MenuItem>
                  <MenuItem value="shipping">Shipping</MenuItem>
                  <MenuItem value="billing">Billing</MenuItem>
                  <MenuItem value="technical">Technical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateTicket}
            variant="contained"
            color="primary"
            disabled={!newTicket.customerName || !newTicket.customerEmail || !newTicket.subject || !newTicket.description}
          >
            Create Ticket
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={replyDialogOpen}
        onClose={() => setReplyDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Reply to Ticket
          {selectedTicket && (
            <Typography variant="subtitle2" color="textSecondary">
              {selectedTicket.subject}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reply"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReplyDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleReplySubmit}
            variant="contained"
            color="primary"
            disabled={!replyContent}
          >
            Send Reply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerInquiries;
