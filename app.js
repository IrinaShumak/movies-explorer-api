const express = require('express');
const helmet = require('helmet');
require('dotenv').config();
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
const errorHandler = require('./middlewares/errors-handler');

const { PORT = 5000 } = process.env;

const app = express();
app.use(helmet());

app.use(cors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {});

app.use(requestLogger); // подключаем логгер запросов

app.use(routes);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());

app.use(errorHandler); // подключаем централизованную обработку ошибок

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
