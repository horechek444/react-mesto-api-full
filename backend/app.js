const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/users.js');
const cardsRoutes = require('./routes/cards.js');
const { ERROR_CODE_BAD_REQUEST } = require('./utils/error_codes');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const app = express();
const PORT = 3000;

const mongoDbUrl = 'mongodb://127.0.0.1:27017/mestodb';
const mongooseConnectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

mongoose.connect(mongoDbUrl, mongooseConnectOptions);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', auth, usersRoutes);
app.use('/cards', auth, cardsRoutes);

app.all('*', (req, res) => res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Запрашиваемый ресурс не найден' }));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
