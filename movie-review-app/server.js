import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import { User } from './src/models/User.js';
import { Movie } from './src/models/Movie.js';
import { Review } from './src/models/Review.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes
// Signup
app.post('/signup', async (req, res) => {
  try {
    const { name, username, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    // Create new user
    const user = new User({ name, username, password });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your-secret-key');
    
    res.status(201).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Login
app.post('/signin', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your-secret-key');
    
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all movies
app.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find().populate('reviews');
    res.json({ success: true, movies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get movie by ID
app.get('/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).populate('reviews');
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    res.json({ success: true, movie });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Search movies
app.post('/movies/search', async (req, res) => {
  try {
    const { searchTerm } = req.body;
    const movies = await Movie.find({
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { 'actors.actorName': { $regex: searchTerm, $options: 'i' } }
      ]
    }).populate('reviews');
    res.json({ success: true, movies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Submit review
app.post('/reviews', authenticateToken, async (req, res) => {
  try {
    const { movieId, rating, review } = req.body;
    
    // Create review
    const newReview = new Review({
      movie: movieId,
      user: req.user.id,
      rating,
      review
    });
    await newReview.save();

    // Update movie's reviews and average rating
    const movie = await Movie.findById(movieId);
    movie.reviews.push(newReview._id);
    
    // Calculate new average rating
    const reviews = await Review.find({ movie: movieId });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    movie.avgRating = totalRating / reviews.length;
    
    await movie.save();

    res.status(201).json({ success: true, review: newReview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 