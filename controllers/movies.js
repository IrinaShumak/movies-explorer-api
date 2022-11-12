const Movie = require('../models/movie');

const NotFoundError = require('../errors/not-found-err');
const IncorrectInputError = require('../errors/incorrect-input-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const id = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink: trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: id,
  })
    .then((movie) => res.send({ movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectInputError('Переданы некорректные данные при создании карточки.'));
        return;
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (movie) {
        if (movie.owner._id.toString() === req.user._id) {
          movie.delete()
            .then(() => res.send({ data: 'Фильм удалён' }))
            .catch(next);
        } else {
          next(new ForbiddenError('Нельзя удалить чужой фильм'));
        }
      } else { next(new NotFoundError('Передан несуществующий _id фильма.')); }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectInputError('Переданы некорректные данные для удаления фильма.'));
        return;
      }
      next(err);
    });
};

module.exports.getAllMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send({ movies }))
    .catch(next);
};

/* module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send(card);
      } else { next(new NotFoundError('Передан несуществующий _id карточки.')); }
    })
    .catch((err) => {
      if ((err.name === 'ValidationError') || (err.name === 'CastError')) {
        next(new IncorrectInputError('Переданы некорректные данные для постановки лайка.'));
        return;
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send(card);
      } else { next(new NotFoundError('Передан несуществующий _id карточки.')); }
    })
    .catch((err) => {
      if ((err.name === 'ValidationError') || (err.name === 'CastError')) {
        next(new IncorrectInputError('Переданы некорректные данные для снятия лайка.'));
        return;
      }
      next(err);
    });
};
*/
