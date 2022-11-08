const jwt = require('jsonwebtoken');
require('dotenv').config();
const AuthorizationError = require('../errors/authorization-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    const err = new AuthorizationError('Необходима авторизация');
    next(err);
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (e) {
    const err = new AuthorizationError('Необходима авторизация');
    next(err);
    return;
  }

  req.user = payload;

  next();
};
