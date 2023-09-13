// Адрес для подключению к базе данных монго в каталог bitfilmsdb
const URL = 'mongodb://127.0.0.1:27017/bitfilmsdb';

// Ключ для разработки
const SECRET_KEY_DEV = 'dev-secret';

// Статус создания нового ресурса
const CREATED_STATUS_CODE = 201;

module.exports = {
  URL,
  SECRET_KEY_DEV,

  CREATED_STATUS_CODE,
};
