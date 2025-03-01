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
  IconButton,
  Chip,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { Permission } from '../../types/permissions';
import { Content, ContentStatus, ContentType } from '../../../types/content';
import ContentService from '../../../services/ContentService';
import RequirePermission from '../../components/auth/RequirePermission';

const ContentManagementPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<ContentStatus | 'ALL'>('ALL');
  const [selectedType, setSelectedType] = useState<ContentType | 'ALL'>('ALL');
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const contentService = ContentService.getInstance();

  const fetchContent = async (status?: ContentStatus, type?: ContentType) => {
    try {
      setLoading(true);
      const filters: Parameters<typeof contentService.listContent>[0] = {};
      if (status && status !== 'ALL') filters.status = status;
      if (type && type !== 'ALL') filters.type = type;
      
      const data = await contentService.listContent(filters);
      setContent(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusTabChange = (_: React.SyntheticEvent, newValue: ContentStatus | 'ALL') => {
    setSelectedTab(newValue);
    fetchContent(newValue === 'ALL' ? undefined : newValue, selectedType === 'ALL' ? undefined : selectedType);
  };

  const handleTypeTabChange = (_: React.SyntheticEvent, newValue: ContentType | 'ALL') => {
    setSelectedType(newValue);
    fetchContent(selectedTab === 'ALL' ? undefined : selectedTab, newValue === 'ALL' ? undefined : newValue);
  };

  const handlePublish = async (contentId: string) => {
    try {
      await contentService.publishContent(contentId);
      await fetchContent(
        selectedTab === 'ALL' ? undefined : selectedTab,
        selectedType === 'ALL' ? undefined : selectedType
      );
    } catch (err) {
      setError('Failed to publish content');
    }
  };

  const handleDelete = async (contentId: string) => {
    try {
      await contentService.deleteContent(contentId);
      await fetchContent(
        selectedTab === 'ALL' ? undefined : selectedTab,
        selectedType === 'ALL' ? undefined : selectedType
      );
    } catch (err) {
      setError('Failed to delete content');
    }
  };

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Title', width: 200 },
    {
      field: 'type',
      headerName: 'Type',
      width: 150,
      renderCell: (params) => (
        <Chip label={params.value} />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === ContentStatus.PUBLISHED
              ? 'success'
              : params.value === ContentStatus.SCHEDULED
              ? 'info'
              : params.value === ContentStatus.DRAFT
              ? 'warning'
              : 'default'
          }
        />
      ),
    },
    {
      field: 'author',
      headerName: 'Author',
      width: 150,
    },
    {
      field: 'updatedAt',
      headerName: 'Last Updated',
      width: 150,
      valueFormatter: (params) =>
        new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box>
          <RequirePermission permissions={[Permission.MANAGE_CONTENT]}>
            <IconButton
              onClick={() => handlePublish(params.row.id)}
              size="small"
              disabled={params.row.status === ContentStatus.PUBLISHED}
            >
              <ViewIcon />
            </IconButton>
          </RequirePermission>
          <RequirePermission permissions={[Permission.MANAGE_CONTENT]}>
            <IconButton size="small">
              <EditIcon />
            </IconButton>
          </RequirePermission>
          <RequirePermission permissions={[Permission.MANAGE_CONTENT]}>
            <IconButton size="small">
              <ScheduleIcon />
            </IconButton>
          </RequirePermission>
          <RequirePermission permissions={[Permission.MANAGE_CONTENT]}>
            <IconButton
              onClick={() => handleDelete(params.row.id)}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </RequirePermission>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Content Management
      </Typography>
      <RequirePermission permissions={[Permission.MANAGE_CONTENT]}>
        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
        >
          Create New Content
        </Button>
      </RequirePermission>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs
                  value={selectedTab}
                  onChange={handleStatusTabChange}
                  sx={{ mb: 2 }}
                >
                  <Tab label="All Status" value="ALL" />
                  {Object.values(ContentStatus).map((status) => (
                    <Tab key={status} label={status} value={status} />
                  ))}
                </Tabs>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Tabs
                  value={selectedType}
                  onChange={handleTypeTabChange}
                  aria-label="content type tabs"
                >
                  <Tab label="All Types" value="ALL" />
                  <Tab label="Blog Posts" value={ContentType.BLOG_POST} />
                  <Tab label="Product Pages" value={ContentType.PRODUCT_PAGE} />
                  <Tab label="Category Pages" value={ContentType.CATEGORY_PAGE} />
                  <Tab label="Landing Pages" value={ContentType.LANDING_PAGE} />
                  <Tab label="Help Articles" value={ContentType.HELP_ARTICLE} />
                </Tabs>
              </Box>

              {error ? (
                <Typography color="error">{error}</Typography>
              ) : (
                <Box sx={{ height: 600, width: '100%' }}>
                  <DataGrid
                    rows={content}
                    columns={columns}
                    loading={loading}
                    pageSizeOptions={[10, 25, 50]}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 10,
                        },
                      },
                    }}
                    disableRowSelectionOnClick
                    sx={{
                      '& .MuiDataGrid-cell': {
                        borderBottom: '1px solid #e0e0e0',
                      },
                    }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContentManagementPage;
