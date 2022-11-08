const movieRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  createMovie,
  deleteMovie,
  getAllMovies,
} = require('../controllers/movies');

movieRouter.get('/', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), getAllMovies);

movieRouter.delete('/:_id', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24).required(),
  }).unknown(true),
}), deleteMovie);

movieRouter.post('/', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/^https?:\/\/(www.)?[\w-]+\..+#?$/),
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().integer().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(/^https?:\/\/(www.)?[\w-]+\..+#?$/),
    trailer: Joi.string().required().regex(/^https?:\/\/(www.)?[\w-]+\..+#?$/),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().regex(/^https?:\/\/(www.)?[\w-]+\..+#?$/),
    movieId: Joi.string().hex().length(24).required(),
  }),
}), createMovie);

module.exports = movieRouter;
