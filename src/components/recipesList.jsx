import React, { useState, useEffect } from 'react';
import { loadRecipes, saveRecipes } from '../utils/localStorageUtils';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Badge,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Add as AddIcon, Star as StarIcon, StarBorder as StarBorderIcon } from '@mui/icons-material';

export default function RecipesList() {
  const [recipes, setRecipes] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();

  useEffect(() => {
    setRecipes(loadRecipes());
  }, []);

  const toggleFavorite = (id) => {
    const updated = recipes.map((r) =>
      r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
    );
    setRecipes(updated);
    saveRecipes(updated);
  };

  const toggleFilter = (diff) =>
    setDifficultyFilter((prev) =>
      prev.includes(diff) ? prev.filter((d) => d !== diff) : [...prev, diff]
    );

  const filtered = recipes
    .filter((r) =>
      difficultyFilter.length ? difficultyFilter.includes(r.difficulty) : true
    )
    .sort((a, b) => {
      const tA = a.steps.reduce((s, st) => s + st.durationMinutes, 0);
      const tB = b.steps.reduce((s, st) => s + st.durationMinutes, 0);
      return sortOrder === 'asc' ? tA - tB : tB - tA;
    });

  return (
    <Container sx={{ py: 4 }}>
      <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
          Recipes
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/create')}
        >
          Create New
        </Button>
      </Grid>

      <Card sx={{ mb: 4, p: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filter & Sort
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Filter by Difficulty:
              </Typography>
              <FormGroup row>
                {['Easy', 'Medium', 'Hard'].map((d) => (
                  <FormControlLabel
                    key={d}
                    control={
                      <Checkbox
                        checked={difficultyFilter.includes(d)}
                        onChange={() => toggleFilter(d)}
                        color="primary"
                      />
                    }
                    label={d}
                  />
                ))}
              </FormGroup>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="sort-order-label">Sort by Total Time</InputLabel>
                <Select
                  labelId="sort-order-label"
                  id="sort-order"
                  value={sortOrder}
                  label="Sort by Total Time"
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {filtered.map((r) => (
          <Grid item xs={12} sm={6} md={4} key={r.id}>
            <Card
              sx={{
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ cursor: 'pointer', mb: 2 }}
                  onClick={() => navigate(`/cook/${r.id}`)}
                >
                  {r.title}
                </Typography>
                <Badge
                  badgeContent={r.difficulty}
                  color={
                    r.difficulty === 'Easy'
                      ? 'success'
                      : r.difficulty === 'Medium'
                        ? 'warning'
                        : 'error'
                  }
                  sx={{ ml: 2, mb:2 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Total Time: {r.steps.reduce((s, st) => s + st.durationMinutes, 0)} mins
                </Typography>
              </CardContent>
              <CardActions>
                <Tooltip title={r.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}>
                  <IconButton onClick={() => toggleFavorite(r.id)} color="warning">
                    {r.isFavorite ? <StarIcon /> : <StarBorderIcon />}
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filtered.length === 0 && (
        <Alert severity="info" sx={{ mt: 4, textAlign: 'center' }}>
          No recipes match the selected filters.
        </Alert>
      )}
    </Container>
  );
}