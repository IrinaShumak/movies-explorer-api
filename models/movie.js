const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: { // страна создания фильма
    type: String, //  это строка
    required: true, // обязательное поле
  },
  director: { // режиссёр фильма
    type: String, //  это строка
    required: true, // обязательное поле
  },
  duration: { // длительность фильма
    type: Number, //  это число
    required: true, // обязательное поле
  },
  year: { // год выпуска фильма
    type: String, //  это число
    required: true, // обязательное поле
  },
  description: { // описание фильма
    type: String, //  это число
    required: true, // обязательное поле
  },
  image: { // ссылка на постер к фильму
    type: String, // это строка
    required: true, // обязательное поле
    validate: {
      validator(v) { // проверка соответствия схеме URL-адреса. v - значение свойства image
        return /^https?:\/\/(www.)?[\w-]+\..+#?$/.test(v);
      },
    },
  },
  trailerLink: { // ссылка на трейлер фильма
    type: String, // это строка
    required: true, // обязательное поле
    validate: {
      validator(v) { // проверка соответствия схеме URL-адреса. v - значение свойства trailerLink
        return /^https?:\/\/(www.)?[\w-]+\..+#?$/.test(v);
      },
    },
  },
  thumbnail: { // миниатюрное изображение постера к фильму
    type: String, // это строка
    required: true, // обязательное поле
    validate: {
      validator(v) { // проверка соответствия схеме URL-адреса. v - значение свойства thumbnail
        return /^https?:\/\/(www.)?[\w-]+\..+#?$/.test(v);
      },
    },
  },
  owner: { // _id пользователя, который сохранил фильм
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: { // id фильма
    type: Number,
    required: true,
  },
  nameRU: { // название фильма на русском языке
    type: String, // это строка
    required: true, // обязательное поле
  },
  nameEN: { // название фильма на английском языке
    type: String, // это строка
    required: true, // обязательное поле
  },
});

module.exports = mongoose.model('movie', movieSchema);
