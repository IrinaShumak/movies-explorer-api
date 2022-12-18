const userRrouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCurrentUser,
  updateUserProfile,
} = require('../controllers/users');

userRrouter.get('/me', getCurrentUser);

userRrouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  }),
}), updateUserProfile);

module.exports = userRrouter;
