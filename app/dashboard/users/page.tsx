'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import UsersTable from '@/components/users/UsersTable';
import { useAuth } from '@/context/AuthContext';

export default function UsersPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (user?.role !== 'admin') {
    return (
      <Box>
        <Typography variant="h5">Access Denied</Typography>
        <Typography>You don't have permission to view this page.</Typography>
      </Box>
    );
  }

  return <UsersTable />;
}