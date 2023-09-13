const movieRouter = require('express').Router();

const {
  createNewMovieValidator,
  removeMovieValidator,
} = require('../middlewares/validation');

const {
  getMovies,
  createNewMovie,
  removeMovie,
} = require('../controllers/movies');

// GET для получения списка фильмов
movieRouter.get('/movies', getMovies);

// POST для создания нового фильма
movieRouter.post('/movies', createNewMovieValidator, createNewMovie);

// DELETE для удаления фильма
movieRouter.delete('/movies/:movieId', removeMovieValidator, removeMovie);

module.exports = movieRouter;
