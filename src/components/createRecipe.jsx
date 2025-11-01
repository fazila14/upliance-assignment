import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { loadRecipes, saveRecipes } from '../utils/localStorageUtils';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Alert,
  Box,
  Stack,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

export default function CreateRecipe() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState('');

  // Predefined list of units for the dropdown
  const unitOptions = [
    'g', // grams
    'kg', // kilograms
    'ml', // milliliters
    'l', // liters
    'tsp', // teaspoon
    'tbsp', // tablespoon
    'cup', // cup
    'oz', // ounce
    'lb', // pound
    'unit', // unit (e.g., for eggs, apples)
  ];

  const addIngredient = () =>
    setIngredients([...ingredients, { id: uuidv4(), name: '', quantity: 1, unit: 'g' }]);

  const updateIngredient = (id, field, value) =>
    setIngredients((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));

  const removeIngredient = (id) => setIngredients((prev) => prev.filter((i) => i.id !== id));

  const addStep = () =>
    setSteps([...steps, { id: uuidv4(), description: '', type: 'instruction', durationMinutes: 1 }]);

  const updateStep = (id, field, value) =>
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));

  const removeStep = (id) => setSteps((prev) => prev.filter((s) => s.id !== id));

  const validate = () => {
    if (title.trim().length < 3) {
      setError('Title must be at least 3 characters long');
      return false;
    }
    if (ingredients.length === 0) {
      setError('At least one ingredient is required');
      return false;
    }
    if (steps.length === 0) {
      setError('At least one step is required');
      return false;
    }
    for (const s of steps) {
      if (s.durationMinutes <= 0) {
        setError('Step duration must be greater than 0');
        return false;
      }
      if (s.type === 'instruction' && (!s.ingredientIds || s.ingredientIds.length === 0)) {
        setError('Instruction steps must reference at least one ingredient');
        return false;
      }
      if (s.type === 'cooking' && !s.cookingSettings) {
        setError('Cooking steps require temperature and speed settings');
        return false;
      }
    }
    return true;
  };

  const save = () => {
    setError('');
    if (!validate()) return;
    const now = new Date().toISOString();
    const recipe = {
      id: uuidv4(),
      title: title.trim(),
      difficulty,
      ingredients,
      steps,
      createdAt: now,
      updatedAt: now,
      isFavorite: false,
    };
    const existing = loadRecipes();
    saveRecipes([...existing, recipe]);
    navigate('/recipes');
  };

  return (
    <Container sx={{ py: 4 }}>
      <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
          Create Recipe
        </Typography>
        <Button variant="contained" color="primary" onClick={save} startIcon={<AddIcon />}>
          Save Recipe
        </Button>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 4, p: 2, boxShadow: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Recipe Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                variant="outlined"
                helperText="Minimum 3 characters"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="difficulty-label">Difficulty</InputLabel>
                <Select
                  labelId="difficulty-label"
                  label="Difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <MenuItem value="Easy">Easy</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Hard">Hard</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Ingredients Section */}
      <Typography variant="h6" gutterBottom>
        Ingredients
      </Typography>
      {ingredients.map((ing) => (
        <Card key={ing.id} sx={{ mb: 2, boxShadow: 2, '&:hover': { boxShadow: 4 } }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  label="Ingredient Name"
                  value={ing.name}
                  onChange={(e) => updateIngredient(ing.id, 'name', e.target.value)}
                  placeholder="e.g., Flour"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Quantity"
                  value={ing.quantity}
                  onChange={(e) => updateIngredient(ing.id, 'quantity', +e.target.value)}
                  inputProps={{ min: 1 }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id={`unit-label-${ing.id}`}>Unit</InputLabel>
                  <Select
                    labelId={`unit-label-${ing.id}`}
                    label="Unit"
                    value={ing.unit}
                    onChange={(e) => updateIngredient(ing.id, 'unit', e.target.value)}
                  >
                    {unitOptions.map((unit) => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={1}>
                <IconButton color="error" onClick={() => removeIngredient(ing.id)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
      <Button variant="outlined" color="primary" onClick={addIngredient} sx={{ mb: 4 }}>
        Add Ingredient
      </Button>

      {/* Steps Section */}
      <Typography variant="h6" gutterBottom>
        Steps
      </Typography>
      {steps.map((step) => (
        <Card key={step.id} sx={{ mb: 3, boxShadow: 3 }}>
          <CardContent>
            <Stack spacing={2}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Step Description"
                value={step.description}
                onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                variant="outlined"
              />

              <FormControl fullWidth>
                <InputLabel id={`step-type-label-${step.id}`}>Step Type</InputLabel>
                <Select
                  labelId={`step-type-label-${step.id}`}
                  value={step.type}
                  onChange={(e) => updateStep(step.id, 'type', e.target.value)}
                  label="Step Type"
                >
                  <MenuItem value="instruction">Instruction</MenuItem>
                  <MenuItem value="cooking">Cooking</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                type="number"
                label="Duration (minutes)"
                value={step.durationMinutes}
                onChange={(e) => updateStep(step.id, 'durationMinutes', +e.target.value)}
                inputProps={{ min: 1 }}
                variant="outlined"
              />

              {step.type === 'instruction' && (
                <FormControl fullWidth>
                  <InputLabel id={`ingredients-used-label-${step.id}`}>Ingredients Used</InputLabel>
                  <Select
                    labelId={`ingredients-used-label-${step.id}`}
                    multiple
                    value={step.ingredientIds || []}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateStep(step.id, 'ingredientIds', typeof val === 'string' ? val.split(',') : val);
                    }}
                    label="Ingredients Used"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((id) => {
                          const ing = ingredients.find((i) => i.id === id);
                          return (
                            <Chip
                              key={id}
                              label={ing ? ing.name || 'Unnamed' : 'Unknown'}
                              size="small"
                              color="primary"
                            />
                          );
                        })}
                      </Box>
                    )}
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 224, width: 250 },
                      },
                    }}
                  >
                    {ingredients.map((i) => (
                      <MenuItem key={i.id} value={i.id}>
                        {i.name || 'Unnamed'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {step.type === 'cooking' && (
                <Stack direction="row" spacing={2}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Temperature (°C)"
                    value={step.cookingSettings?.temperature || 40}
                    onChange={(e) =>
                      updateStep(step.id, 'cookingSettings', {
                        temperature: +e.target.value,
                        speed: step.cookingSettings?.speed || 1,
                      })
                    }
                    inputProps={{ min: 40, max: 200 }}
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    type="number"
                    label="Speed"
                    value={step.cookingSettings?.speed || 1}
                    onChange={(e) =>
                      updateStep(step.id, 'cookingSettings', {
                        temperature: step.cookingSettings?.temperature || 40,
                        speed: +e.target.value,
                      })
                    }
                    inputProps={{ min: 1, max: 5 }}
                    variant="outlined"
                  />
                </Stack>
              )}
            </Stack>
          </CardContent>
          <CardActions>
            <IconButton color="error" onClick={() => removeStep(step.id)}>
              <DeleteIcon />
            </IconButton>
          </CardActions>
        </Card>
      ))}
      <Button variant="outlined" color="primary" onClick={addStep} sx={{ mb: 4 }}>
        Add Step
      </Button>
    </Container>
  );
}
