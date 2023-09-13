const Movie = require('../models/movie');
const InvalidDataError = require('../errors/InvalidDataError');
const NotFoundPageError = require('../errors/NotFoundPageError');
const AccessDeniedError = require('../errors/AccessDeniedError');

// Получение фильмов
const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

// Создание нового фильма
const createNewMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new InvalidDataError(
            'Переданы некорректные данные при создании новой карточки фильма',
          ),
        );
      } else {
        next(err);
      }
    });
};

// Удаление фильма
const removeMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundPageError('Фильм с указанным id не найден');
    })
    .then((movie) => {
      const owner = movie.owner.toString();
      if (req.user._id === owner) {
        Movie.deleteOne(movie)
          .then(() => {
            res.send(movie);
          })
          .catch(next);
      } else {
        throw new AccessDeniedError('Невозможно удалить данный фильм');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new InvalidDataError(
            'Переданы некорректные данные для удаления данного фильма',
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createNewMovie,
  removeMovie,
};
