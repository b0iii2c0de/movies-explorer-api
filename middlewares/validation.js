// Подключение модуля celebrate из пакета celebrate.
const { Joi, celebrate } = require('celebrate');

// шаблон регулярного выражения
const regexUrl = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

// Валидатор проверки данных создания нового пользователя
const registrationValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string()
      .required()
      .email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
});

// Валидатор проверки данных входa пользователя в приложение
const loginValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
});

// Валидатор проверки данных получения информации о пользователе
const getUserInfoValidator = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
});

// Валидатор проверки данных редактирования данных пользователя
const editUserInfoValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string()
      .required()
      .email({ tlds: { allow: false } }),
  }),
});

// Валидатор проверки данных создания нового фильма
const createNewMovieValidator = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(regexUrl),
    trailerLink: Joi.string().required().regex(regexUrl),
    thumbnail: Joi.string().required().regex(regexUrl),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

// Валидатор проверки данных удаления фильма
const removeMovieValidator = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
});

module.exports = {
  loginValidator,
  registrationValidator,
  createNewMovieValidator,
  getUserInfoValidator,
  removeMovieValidator,
  editUserInfoValidator,
};
