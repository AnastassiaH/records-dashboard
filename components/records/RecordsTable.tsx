'use client';

import { useState, useEffect, useCallback } from 'react';
import { DataGrid, GridColDef, GridActionsCellItem, GridRowSelectionModel } from '@mui/x-data-grid';
import { Box, Button, Typography, Checkbox, IconButton, Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { recordsService } from '@/lib/api/records.service';
import { Record } from '@/types';
import { useAuth } from '@/context/AuthContext';
import RecordEditDialog from './RecordEditDialog';
import DeleteConfirmDialog from '../common/DeleteConfirmDialog';

export default function RecordsTable() {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [editRecord, setEditRecord] = useState<Record | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<{ id: number | number[]; title: string } | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const loadRecords = async () => {
    setLoading(true);
    try {
      const data = await recordsService.getAll();
      setRecords(data);
    } catch (error) {
      console.error('Error loading records:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleDeleteClick = (id: number | number[], title: string) => {
    setRecordToDelete({ id, title });
  };


  const handleDeleteSelected = () => {
    if (selectedRows.length === 0) return;
    handleDeleteClick(selectedRows, `${selectedRows.length} selected records`);
  };

  const handleBulkDelete = async () => {
    if (!recordToDelete || !Array.isArray(recordToDelete.id)) return;

    setDeleteLoading(true);
    try {
      await Promise.all(recordToDelete.id.map(id => recordsService.delete(id)));
      setSelectedRows([]);
      setRecordToDelete(null);
      loadRecords();
    } catch (error) {
      console.error('Error deleting selected records:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSingleDelete = async () => {
    if (!recordToDelete || Array.isArray(recordToDelete.id)) return;

    setDeleteLoading(true);
    try {
      await recordsService.delete(recordToDelete.id);
      loadRecords();
      setRecordToDelete(null);
    } catch (error) {
      console.error('Error deleting record:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
    setSelectedRows(newSelection as number[]);
  };

  const canEdit = (record: Record) => {
    return user?.role === 'admin' || record.authorId === user?.id;
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 0.5,
      minWidth: 60,
    },
    {
      field: 'title',
      headerName: 'Title',
      flex: 2,
      minWidth: 200,
    },
    {
      field: 'content',
      headerName: 'Content',
      flex: 3,
      minWidth: 300,
    },
    {
      field: 'authorId',
      headerName: 'Author ID',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      flex: 0.8,
      minWidth: 120,
      getActions: (params) =>
        canEdit(params.row)
          ? [
            <GridActionsCellItem
              key="delete"
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() => handleDeleteClick(params.row.id, params.row.title)}
              disabled={!canEdit(params.row as Record)}
              showInMenu={false}
            />,
            <GridActionsCellItem
              key="edit"
              icon={<EditIcon />}
              label="Edit"
              onClick={() => setEditRecord(params.row as Record)}
              disabled={!canEdit(params.row as Record)}
              showInMenu={false}
            />,
          ]
          : [],
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <Typography variant="h5">Records</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {selectedRows.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteSelected}
              disabled={deleteLoading}
            >
              Delete Selected ({selectedRows.length})
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/dashboard/records/new')}
          >
            Add Record
          </Button>
        </Box>
      </Box>

      <DataGrid
        rows={records}
        columns={columns}
        loading={loading || deleteLoading}
        autoHeight
        pageSizeOptions={[5, 10, 25]}
        checkboxSelection
        disableColumnMenu
        onRowSelectionModelChange={handleSelectionChange}
        rowSelectionModel={selectedRows}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        disableRowSelectionOnClick={false}
      />

      {editRecord && (
        <RecordEditDialog
          record={editRecord}
          open={!!editRecord}
          onClose={() => setEditRecord(null)}
          onSuccess={loadRecords}
        />
      )}

      <DeleteConfirmDialog
        open={!!recordToDelete}
        title={Array.isArray(recordToDelete?.id) ? 'Delete Multiple Records' : 'Delete Record'}
        content={
          Array.isArray(recordToDelete?.id)
            ? `Are you sure you want to delete ${recordToDelete?.id.length} selected records? This action cannot be undone.`
            : `Are you sure you want to delete "${recordToDelete?.title}"?`
        }
        onClose={() => setRecordToDelete(null)}
        onConfirm={Array.isArray(recordToDelete?.id) ? handleBulkDelete : handleSingleDelete}
        loading={deleteLoading}
      />
    </Box>
  );
}