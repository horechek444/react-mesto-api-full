const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/users.js');
const cardsRoutes = require('./routes/cards.js');
const { ERROR_CODE_BAD_REQUEST } = require('./utils/error_codes');

const app = express();
const PORT = 3000;

const mongoDbUrl = 'mongodb://localhost:27017/mestodb';
const mongooseConnectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

mongoose.connect(mongoDbUrl, mongooseConnectOptions);

app.use((req, res, next) => {
  req.user = {
    _id: '5f9330c206245a0af5dd63ff',
  };
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

app.all('*', (req, res) => res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Запрашиваемый ресурс не найден' }));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
