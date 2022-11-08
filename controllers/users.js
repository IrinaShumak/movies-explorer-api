const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/not-found-err');
const IncorrectInputError = require('../errors/incorrect-input-err');
const DublicationError = require('../errors/dublication-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name,
      _id: user._id,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
      // Возникает, если мы попытаемся записать данные в базу, не соответствущие схеме,
      // например, имя юзера меньше 2 или больше 30 знаков
        next(new IncorrectInputError('Переданы некорректные данные при создании пользователя'));
      } else if (err.code === 11000) {
        next(new DublicationError('Такая почта уже существует'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res
        .send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else { next(new NotFoundError('Пользователь с указанным _id не найден.')); }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectInputError('Переданы некорректные данные при запросе.'));
        return;
      }
      next(err);
    });
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true }, // обработчик then получит на вход обновлённую запись
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectInputError('Переданы некорректные данные при обновлении профиля'));
        return;
      }
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь с указанным _id не найден.'));
        return;
      }
      next(err);
    });
};
