import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Rating,
  TextField,
  Button,
  Box,
} from '@mui/material';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get(`${config.ENDPOINTS.MOVIES}?reviews=true`);
      if (response.data.success) {
        setMovies(response.data.movies);
      }
    } catch (error) {
      setError('Failed to fetch movies');
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.post(config.ENDPOINTS.SEARCH, {
        searchTerm
      });
      if (response.data.success) {
        setMovies(response.data.movies);
      }
    } catch (error) {
      setError('Failed to search movies');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <TextField
            fullWidth
            label="Search Movies"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{ minWidth: '100px' }}
          >
            Search
          </Button>
        </Box>
        <Grid container spacing={3}>
          {movies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} key={movie._id}>
              <Card
                sx={{ height: '100%', cursor: 'pointer' }}
                onClick={() => navigate(`/movie/${movie._id}`)}
              >
                <CardMedia
                  component="img"
                  height="300"
                  image={movie.imageUrl || 'https://via.placeholder.com/300x450'}
                  alt={movie.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {movie.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {movie.genre} • {movie.releaseDate}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Rating
                      value={movie.avgRating || 0}
                      precision={0.5}
                      readOnly
                    />
                    <Typography variant="body2" color="text.secondary">
                      {movie.avgRating ? movie.avgRating.toFixed(1) : 'No ratings yet'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default MovieList; 