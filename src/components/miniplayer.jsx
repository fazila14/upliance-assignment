import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Typography, Button, Box, Tooltip } from '@mui/material';
import { PlayArrow, Pause, Stop } from '@mui/icons-material';

export default function MiniPlayer({ active, stepIndex, totalSteps, remainingSec, isRunning, onToggle, onStop }) {
  const navigate = useNavigate();

  if (!active) return null;

  const format = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <Paper
      elevation={6}
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        borderRadius: 2,
        p: 2,
        minWidth: 250,
        maxWidth: 350,
        bgcolor: 'background.paper',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8],
        },
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          cursor: 'pointer',
          mb: 2,
          '&:hover': { textDecoration: 'underline' },
        }}
        onClick={() => navigate(`/cook/${active.id}`)}
      >
        <Typography variant="subtitle1" fontWeight="bold" color="primary">
          {active.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Step {stepIndex + 1}/{totalSteps} · {format(remainingSec)}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Tooltip title={isRunning ? 'Pause the timer' : 'Resume the timer'}>
          <Button
            variant="contained"
            color={isRunning ? 'secondary' : 'primary'}
            size="small"
            startIcon={isRunning ? <Pause /> : <PlayArrow />}
            onClick={onToggle}
          >
            {isRunning ? 'Pause' : 'Resume'}
          </Button>
        </Tooltip>
        <Tooltip title="Stop the current step">
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<Stop />}
            onClick={onStop}
          >
            Stop
          </Button>
        </Tooltip>
      </Box>
    </Paper>
  );
}