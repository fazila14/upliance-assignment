import React from 'react';
import { BrowserRouter, Routes, Route, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  CssBaseline,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Kitchen } from '@mui/icons-material';
import RecipesList from './components/recipesList';
import CreateRecipe from './components/createRecipe';
import CookRecipe from './components/cookRecipe';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' }, // Blue for primary actions
    secondary: { main: '#dc004e' }, // Red for secondary actions
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <AppBar position="fixed">
            <Toolbar>
              <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}  to="/">
                Recipe App
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/recipes"
                  sx={{ textTransform: 'none' }}
                >
                  Recipes
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/create"
                  sx={{ textTransform: 'none' }}
                >
                  Create Recipe
                </Button>
              </Box>
            </Toolbar>
          </AppBar>
          <Box component="main" sx={{ flexGrow: 1, mt: 8, p: 2 }}>
            <Routes>
              <Route path="/" element={<RecipesList />} />
              <Route path="/recipes" element={<RecipesList />} />
              <Route path="/create" element={<CreateRecipe />} />
              <Route path="/cook/:id" element={<CookRecipe />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}