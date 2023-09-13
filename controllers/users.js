const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundPageError = require('../errors/NotFoundPageError');
const InvalidDataError = require('../errors/InvalidDataError');
const DuplicateDataError = require('../errors/DuplicateDataError');
const { CREATED_STATUS_CODE } = require('../utils/constants');
const { SECRET_KEY_DEV } = require('../utils/constants');

const { NODE_ENV, SECRET_KEY } = process.env;

// Регистрация пользователя
const registration = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    }))
    .then((user) => res.status(CREATED_STATUS_CODE).send({
      email: user.email,
      name: user.name,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(
          new DuplicateDataError(
            'Такой пользователь уже существует в базе данных',
          ),
        );
      } else if (err.name === 'ValidationError') {
        next(
          new InvalidDataError(
            'Переданы некорректные данные при создании нового пользователя',
          ),
        );
      } else {
        next(err);
      }
    });
};

// Логин пользователя
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // Создание JWT-токена
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? SECRET_KEY : SECRET_KEY_DEV,
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

// Получение данных о пользователе
const getUserInfo = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => {
      throw new NotFoundPageError('Пользователь по указанному id не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new InvalidDataError(
            'Запрашиваемый пользователь не найден в базе данных',
          ),
        );
      } else {
        next(err);
      }
    });
};

// Редактирование данных пользователя
const editUserInfo = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new NotFoundPageError('Пользователь с указанным id не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(
          new DuplicateDataError(
            'Такой пользователь уже существует в базе данных',
          ),
        );
      } else if (err.name === 'ValidationError') {
        next(
          new InvalidDataError(
            'Переданы некорректные данные при редактировании профиля',
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports = {
  registration,
  login,
  getUserInfo,
  editUserInfo,
};
