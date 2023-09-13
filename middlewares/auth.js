const jwt = require('jsonwebtoken');
const AuthenticationError = require('../errors/AuthenticationError');
const { SECRET_KEY_DEV } = require('../utils/constants');

const { NODE_ENV, SECRET_KEY } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new AuthenticationError('Необходимо авторизоваться');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? SECRET_KEY : SECRET_KEY_DEV,
    );
  } catch (err) {
    next(new AuthenticationError('Необходимо авторизоваться'));
    return;
  }
  req.user = payload;
  next();
};
