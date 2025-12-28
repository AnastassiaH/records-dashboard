'use client';

import { useState, useEffect, useContext } from 'react';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { usersService } from '@/lib/api/users.service';
import { User } from '@/types';
import UserEditDialog from './UserEditDialog';
import UserDeleteConfirm from './UserDeleteConfirm';
import { useAuth } from '@/context/AuthContext';

export default function UsersTable() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await usersService.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      if (currentUser?.id === id) {
        console.error('Cannot delete your own account');
        setDeleteUserId(null);
        return;
      }
      await usersService.delete(id);
      loadUsers();
      setDeleteUserId(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 0.5,
      minWidth: 60,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 2,
      minWidth: 200,
    },
    {
      field: 'firstName',
      headerName: 'First Name',
      flex: 1.5,
      minWidth: 150,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      flex: 1.5,
      minWidth: 150,
    },
    {
      field: 'role',
      headerName: 'Role',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      flex: 1.2,
      minWidth: 120,
      getActions: (params) => {
        const isCurrentUser = currentUser?.id === params.row.id;

        const actions = [
          <GridActionsCellItem
            key="edit"
            icon={<EditIcon />}
            label="Edit"
            onClick={() => setEditUser(params.row)}
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteIcon />}
            label="Delete"
            disabled={isCurrentUser}
            onClick={() => !isCurrentUser && setDeleteUserId(params.row.id)}
          />
        ];

        return actions;
      },
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>

      <DataGrid
        rows={users}
        columns={columns}
        loading={loading}
        autoHeight
        pageSizeOptions={[5, 10, 25]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        sx={{
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'background.paper',
          },
          '& .MuiDataGrid-columnHeader': {
            '&:focus': {
              outline: 'none',
            },
          },
          '& .MuiDataGrid-cell': {
            '&:focus': {
              outline: 'none',
            },
          },
        }}
      />

      {editUser && (
        <UserEditDialog
          user={editUser}
          open={!!editUser}
          onClose={() => setEditUser(null)}
          onSuccess={loadUsers}
        />
      )}

      {deleteUserId && (
        <UserDeleteConfirm
          open={!!deleteUserId}
          onClose={() => setDeleteUserId(null)}
          onConfirm={() => handleDelete(deleteUserId)}
        />
      )}
    </Box>
  );
}