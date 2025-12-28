'use client';

import { Typography, Paper, Box } from '@mui/material';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        Welcome to Dashboard
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Hello, {user?.firstName} {user?.lastName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Role: {user?.role}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          Use the sidebar to navigate to Users or Records sections.
        </Typography>
      </Paper>
    </Box>
  );
}