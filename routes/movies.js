const movieRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  createMovie,
  deleteMovie,
  getAllMovies,
} = require('../controllers/movies');

movieRouter.get('/', getAllMovies);

movieRouter.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24).required(),
  }),
}), deleteMovie);

movieRouter.post('/', celebrate({
  body: Joi.object().keys({
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
    movieId: Joi.number().unsafe().integer().required(),
  }),
}), createMovie);

module.exports = movieRouter;
