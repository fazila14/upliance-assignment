import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadRecipes } from '../utils/localStorageUtils';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  LinearProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Box,
  Alert,
} from '@mui/material';
import { PlayArrow, Pause, Stop, ArrowBack } from '@mui/icons-material';

export default function CookRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [remainingSec, setRemainingSec] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [lastTick, setLastTick] = useState(Date.now());
  const [error, setError] = useState('');
  const timer = useRef(null);

  useEffect(() => {
    const r = loadRecipes().find((r) => r.id === id);
    if (!r) {
      setError('Recipe not found');
      setTimeout(() => navigate('/recipes'), 2000);
      return;
    }
    setRecipe(r);
    setRemainingSec(r.steps[0].durationMinutes * 60);
  }, [id, navigate]);

  useEffect(() => {
    if (!isRunning || !recipe) return;
    timer.current = setInterval(() => {
      const now = Date.now();
      const delta = Math.floor((now - lastTick) / 1000);
      if (delta >= 1) {
        setRemainingSec((prev) => {
          const newVal = prev - delta;
          if (newVal <= 0) {
            clearInterval(timer.current);
            if (currentStepIndex + 1 < recipe.steps.length) {
              setCurrentStepIndex(currentStepIndex + 1);
              setRemainingSec(recipe.steps[currentStepIndex + 1].durationMinutes * 60);
              setLastTick(now);
              return recipe.steps[currentStepIndex + 1].durationMinutes * 60;
            } else {
              setError('Recipe complete!');
              setIsRunning(false);
              return 0;
            }
          }
          return newVal;
        });
        setLastTick(now);
      }
    }, 1000);
    return () => clearInterval(timer.current);
  }, [isRunning, currentStepIndex, lastTick, recipe]);

  if (!recipe) {
    return (
      <Container sx={{ py: 4 }}>
        {error ? <Alert severity="error">{error}</Alert> : <Typography>Loading...</Typography>}
      </Container>
    );
  }

  const step = recipe.steps[currentStepIndex];
  const stepDur = step.durationMinutes * 60;
  const stepElapsed = stepDur - remainingSec;
  const stepPct = Math.round((stepElapsed / stepDur) * 100);
  const totalDur = recipe.steps.reduce((a, s) => a + s.durationMinutes * 60, 0);
  const totalElapsed =
    recipe.steps.slice(0, currentStepIndex).reduce((a, s) => a + s.durationMinutes * 60, 0) + stepElapsed;
  const overallPct = Math.round((totalElapsed / totalDur) * 100);

  const format = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <Container sx={{ py: 4 }}>
      <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
          {recipe.title} ({recipe.difficulty})
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/recipes')}
        >
          Back to Recipes
        </Button>
      </Grid>

      {error && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 4, boxShadow: 3, '&:hover': { boxShadow: 6 } }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Step {currentStepIndex + 1} of {recipe.steps.length}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3, position: 'relative' }}>
            <CircularProgress
              variant="determinate"
              value={stepPct}
              size={200}
              thickness={4}
              sx={{ color: 'success.main' }}
            />
            <Typography
              variant="h5"
              sx={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)' }}
            >
              {format(remainingSec)}
            </Typography>
          </Box>
          <Typography variant="body1" paragraph>
            {step.description}
          </Typography>

          {step.type === 'cooking' && (
            <Typography variant="body2" color="text.secondary">
              Temperature: {step.cookingSettings.temperature}°C | Speed: {step.cookingSettings.speed}
            </Typography>
          )}
          {step.type === 'instruction' && step.ingredientIds && (
            <List dense>
              {step.ingredientIds.map((id) => {
                const ing = recipe.ingredients.find((i) => i.id === id);
                return (
                  <ListItem key={id}>
                    <ListItemText primary={`${ing.name} - ${ing.quantity}${ing.unit}`} />
                  </ListItem>
                );
              })}
            </List>
          )}
        </CardContent>
        <CardActions sx={{ justifyContent: 'center' }}>
          <Button
            variant="contained"
            color={isRunning ? 'secondary' : 'primary'}
            startIcon={isRunning ? <Pause /> : <PlayArrow />}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? 'Pause' : 'Start / Resume'}
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Stop />}
            onClick={() => {
              clearInterval(timer.current);
              if (currentStepIndex + 1 < recipe.steps.length) {
                setCurrentStepIndex(currentStepIndex + 1);
                setRemainingSec(recipe.steps[currentStepIndex + 1].durationMinutes * 60);
                setIsRunning(true);
              } else {
                setError('Step ended');
                setIsRunning(false);
              }
            }}
          >
            Stop
          </Button>
        </CardActions>
      </Card>

      <Typography variant="subtitle1" gutterBottom>
        Overall Progress: {overallPct}%
      </Typography>
      <LinearProgress variant="determinate" value={overallPct} sx={{ height: 12, borderRadius: 2 }} />
    </Container>
  );
}