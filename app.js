// Подключаю пакет dotenv, чтобы секретный
// ключ из файла .env работал на удаленном сервере
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');
const limiter = require('./middlewares/rateLimiter');
const cors = require('./middlewares/cors');
const { URL } = require('./utils/constants');

const { PORT = 3000 } = process.env;

const app = express();

mongoose
  .connect(URL)
  .then(() => {
    console.log('БД успешно я подключена');
  })
  .catch(() => {
    console.log('Не удалось подключиться к БД, попробуйте проверить конфигурацию путей');
  });

app.use(express.json());

app.use(cors);

app.use(requestLogger);

app.use(helmet());

app.use(limiter);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
