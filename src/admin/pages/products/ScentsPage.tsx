import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Button, Paper } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { ScentService } from '../../../services/ScentService';
import { ScentNote, ScentFamily, ScentCombination, ScentProfile } from '../../types/Scent';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import NoteForm from '../../components/scents/NoteForm';
import FamilyForm from '../../components/scents/FamilyForm';
import CombinationForm from '../../components/scents/CombinationForm';
import ProfileForm from '../../components/scents/ProfileForm';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const ScentsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [notes, setNotes] = useState<ScentNote[]>([]);
  const [families, setFamilies] = useState<ScentFamily[]>([]);
  const [combinations, setCombinations] = useState<ScentCombination[]>([]);
  const [profiles, setProfiles] = useState<ScentProfile[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  const scentService = ScentService.getInstance();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [notesData, familiesData, combinationsData, profilesData] = await Promise.all([
        scentService.getNotes(),
        scentService.getFamilies(),
        scentService.getCombinations(),
        scentService.getProfiles()
      ]);

      setNotes(notesData);
      setFamilies(familiesData);
      setCombinations(combinationsData);
      setProfiles(profilesData);
    } catch (error) {
      enqueueSnackbar('Error loading scent data', { variant: 'error' });
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setSelectedItem(null);
    loadData();
  };

  const handleDelete = async (id: string) => {
    try {
      switch (tabValue) {
        case 0:
          await scentService.deleteNote(id);
          break;
        case 1:
          await scentService.deleteFamily(id);
          break;
        case 2:
          await scentService.deleteCombination(id);
          break;
        case 3:
          await scentService.deleteProfile(id);
          break;
      }
      enqueueSnackbar('Item deleted successfully', { variant: 'success' });
      loadData();
    } catch (error) {
      enqueueSnackbar('Error deleting item', { variant: 'error' });
    }
  };

  const getColumns = (type: 'notes' | 'families' | 'combinations' | 'profiles'): GridColDef[] => {
    const baseColumns: GridColDef[] = [
      { field: 'name', headerName: 'Name', flex: 1 },
      { field: 'description', headerName: 'Description', flex: 2 },
      { field: 'isActive', headerName: 'Active', width: 100, type: 'boolean' },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 120,
        renderCell: (params) => (
          <Box>
            <Button size="small" onClick={() => handleEdit(params.row)}>Edit</Button>
            <Button size="small" color="error" onClick={() => handleDelete(params.row.id)}>Delete</Button>
          </Box>
        ),
      },
    ];

    switch (type) {
      case 'notes':
        return [
          ...baseColumns,
          { field: 'category', headerName: 'Category', width: 120 },
          { field: 'intensity', headerName: 'Intensity', width: 100 },
        ];
      case 'families':
        return [
          ...baseColumns,
          { field: 'notesCount', headerName: 'Notes', width: 100, valueGetter: (params) => params.row.notes.length },
        ];
      case 'combinations':
        return [
          ...baseColumns,
          { field: 'intensity', headerName: 'Intensity', width: 100 },
          { field: 'seasons', headerName: 'Seasons', width: 200, valueGetter: (params) => params.row.seasons.join(', ') },
          { field: 'moods', headerName: 'Moods', width: 200, valueGetter: (params) => params.row.moods.join(', ') },
        ];
      case 'profiles':
        return [
          ...baseColumns,
          { field: 'intensity', headerName: 'Intensity', width: 100 },
          { field: 'seasons', headerName: 'Seasons', width: 200, valueGetter: (params) => params.row.seasons.join(', ') },
          { field: 'moods', headerName: 'Moods', width: 200, valueGetter: (params) => params.row.moods.join(', ') },
        ];
      default:
        return baseColumns;
    }
  };

  return (
    <div className="p-6">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <h1 className="text-2xl font-semibold">Scents Management</h1>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add {tabValue === 0 ? 'Note' : tabValue === 1 ? 'Family' : tabValue === 2 ? 'Combination' : 'Profile'}
        </Button>
      </Box>

      <Paper sx={{ width: '100%' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Notes" />
          <Tab label="Families" />
          <Tab label="Combinations" />
          <Tab label="Profiles" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <DataGrid
            rows={notes}
            columns={getColumns('notes')}
            autoHeight
            pageSize={10}
            rowsPerPageOptions={[10]}
            disableSelectionOnClick
          />
          {isFormOpen && (
            <NoteForm
              open={isFormOpen}
              onClose={handleClose}
              note={selectedItem}
            />
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <DataGrid
            rows={families}
            columns={getColumns('families')}
            autoHeight
            pageSize={10}
            rowsPerPageOptions={[10]}
            disableSelectionOnClick
          />
          {isFormOpen && (
            <FamilyForm
              open={isFormOpen}
              onClose={handleClose}
              family={selectedItem}
              notes={notes}
            />
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <DataGrid
            rows={combinations}
            columns={getColumns('combinations')}
            autoHeight
            pageSize={10}
            rowsPerPageOptions={[10]}
            disableSelectionOnClick
          />
          {isFormOpen && (
            <CombinationForm
              open={isFormOpen}
              onClose={handleClose}
              combination={selectedItem}
              notes={notes}
            />
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <DataGrid
            rows={profiles}
            columns={getColumns('profiles')}
            autoHeight
            pageSize={10}
            rowsPerPageOptions={[10]}
            disableSelectionOnClick
          />
          {isFormOpen && (
            <ProfileForm
              open={isFormOpen}
              onClose={handleClose}
              profile={selectedItem}
              notes={notes}
            />
          )}
        </TabPanel>
      </Paper>
    </div>
  );
};

export default ScentsPage;
