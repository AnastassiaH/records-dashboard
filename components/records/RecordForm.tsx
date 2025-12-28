'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { recordsService } from '@/lib/api/records.service';
import { useAuth } from '@/context/AuthContext';

export default function RecordForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await recordsService.create({
        title,
        content,
        authorId: user!.id,
      });
      router.push('/dashboard/records');
    } catch (error) {
      console.error('Error creating record:', error);
    }

    setLoading(false);
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Create New Record
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          margin="normal"
          multiline
          rows={6}
          required
        />

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            fullWidth
          >
            {loading ? 'Creating...' : 'Create'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push('/dashboard/records')}
            fullWidth
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}