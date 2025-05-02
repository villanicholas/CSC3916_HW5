const config = {
  ENDPOINTS: {
    LOGIN: `${process.env.REACT_APP_API_URL}/signin`,
    SIGNUP: `${process.env.REACT_APP_API_URL}/signup`,
    MOVIES: `${process.env.REACT_APP_API_URL}/movies`,
    MOVIE_DETAIL: (id) => `${process.env.REACT_APP_API_URL}/movies/${id}`,
    REVIEWS: `${process.env.REACT_APP_API_URL}/reviews`,
    SEARCH: `${process.env.REACT_APP_API_URL}/movies/search`
  }
};

export default config; 