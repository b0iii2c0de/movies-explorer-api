const router = require('express').Router();
const { registration, login } = require('../controllers/users');
const auth = require('../middlewares/auth');

const NotFoundPageError = require('../errors/NotFoundPageError');

// Импорт маршрутов пользователей и фильмов
const userRouter = require('./users');
const movieRouter = require('./movies');

// Импорт валидаторов
const {
  loginValidator,
  registrationValidator,
} = require('../middlewares/validation');

// POST для регистрации пользователя
router.post('/signup', registrationValidator, registration);

// POST для входа пользователя
router.post('/signin', loginValidator, login);

router.use(auth);

// Использование маршрутов с пользователями и фильмами
router.use('/', userRouter);
router.use('/', movieRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundPageError('Страница не найдена'));
});

module.exports = router;
