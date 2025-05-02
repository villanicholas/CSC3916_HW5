const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export default {
  API_URL,
  ENDPOINTS: {
    LOGIN: `${API_URL}/signin`,
    SIGNUP: `${API_URL}/signup`,
    MOVIES: `${API_URL}/movies`,
    MOVIE_DETAIL: (id) => `${API_URL}/movies/${id}`,
    REVIEWS: `${API_URL}/reviews`,
    SEARCH: `${API_URL}/movies/search`,
  },
}; 