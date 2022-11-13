const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRrouter = require('./users');
const movieRouter = require('./movies');
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../errors/not-found-err');
const auth = require('../middlewares/auth');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), createUser);

router.use(auth);

router.use('/users', userRrouter);

router.use('/movies', movieRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = router;
