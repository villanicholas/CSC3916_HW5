import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import {
  Container,
  Paper,
  Typography,
  Rating,
  TextField,
  Button,
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
} from '@mui/material';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchMovieDetails = async () => {
    try {
      const response = await axios.get(`${config.ENDPOINTS.MOVIE_DETAIL(id)}?reviews=true`);
      if (response.data.success) {
        setMovie(response.data.movie);
      }
    } catch (error) {
      setError('Failed to fetch movie details');
    }
  };

  useEffect(() => {
    fetchMovieDetails();
  }, [id, fetchMovieDetails]);

  const handleSubmitReview = async () => {
    try {
      const response = await axios.post(config.ENDPOINTS.REVIEWS, {
        movieId: id,
        rating,
        review,
      });

      if (response.data.success) {
        setSuccess('Review submitted successfully');
        setRating(0);
        setReview('');
        fetchMovieDetails();
      }
    } catch (error) {
      setError('Failed to submit review');
    }
  };

  if (!movie) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3}>
              <Box
                component="img"
                src={movie.imageUrl || 'https://via.placeholder.com/300x450'}
                alt={movie.title}
                sx={{ width: '100%', height: 'auto' }}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h4" gutterBottom>
                {movie.title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {movie.genre} • {movie.releaseDate}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={movie.avgRating || 0} precision={0.5} readOnly />
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {movie.avgRating ? movie.avgRating.toFixed(1) : 'No ratings yet'}
                </Typography>
              </Box>

              <Typography variant="h6" gutterBottom>
                Cast
              </Typography>
              <List>
                {movie.actors.map((actor, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={actor.actorName}
                      secondary={actor.characterName}
                    />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Reviews
              </Typography>
              {movie.movieReviews && movie.movieReviews.length > 0 ? (
                <List>
                  {movie.movieReviews.map((review, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="subtitle1">
                              {review.username}
                            </Typography>
                            <Rating
                              value={review.rating}
                              size="small"
                              readOnly
                              sx={{ ml: 1 }}
                            />
                          </Box>
                        }
                        secondary={review.review}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>No reviews yet</Typography>
              )}

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Write a Review
              </Typography>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              )}
              <Box sx={{ mb: 2 }}>
                <Rating
                  value={rating}
                  onChange={(event, newValue) => setRating(newValue)}
                />
              </Box>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Your Review"
                variant="outlined"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitReview}
                disabled={!rating || !review}
              >
                Submit Review
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default MovieDetail; 