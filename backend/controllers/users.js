const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {
  ERROR_CODE_USER, ERROR_CODE_BAD_REQUEST, ERROR_CODE_SERVER, message400, message500,
} = require('../utils/error_codes');
const jwtVerify = require('../utils/jwt-verify');
const jwtSign = require('../utils/jwt-sign');

const getUsers = async (req, res) => {
  try {
    const isVerified = await jwtVerify(req.headers.authorization);
    if (!isVerified) {
      return res.status(401).send({message: 'forbidden'} )
    } else {
      const users = await User.find({});
      res.send(users);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(ERROR_CODE_USER).send({ message: message400 });
    } else {
      res.status(ERROR_CODE_SERVER).send({ message: message500 });
    }
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    console.log(req.user);
    if (!user) {
      res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Нет пользователя с таким id' });
    } else {
      res.send(user);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(ERROR_CODE_USER).send({ message: message400 });
    } else {
      res.status(ERROR_CODE_SERVER).send({ message: message500 });
    }
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    console.log(user);
    if (!user) {
      res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Нет пользователя с таким id' });
    } else {
      res.send(user);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(ERROR_CODE_USER).send({ message: message400 });
    } else {
      res.status(ERROR_CODE_SERVER).send({ message: message500 });
    }
  }
};

const createUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(ERROR_CODE_USER).send({ message: message400 });
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(409).send({ message: 'Уже есть такой email' });
      }

      return bcrypt.hash(password, 10);
    })
    .then((hash) => {
      User.create({ email, password: hash })
        .then(({ email, _id }) => {
          res.send({ email, _id })
        })
        .catch(err => {
          res.status(ERROR_CODE_SERVER).send({ message: message500 });
        })
    })
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(ERROR_CODE_USER).send({ message: message400 });
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          const token = jwtSign(user._id); // todo
          res.send(token);
        })
    })
    .catch((err) => {
      res
        .status(401).send({ message: err.message });
    });
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, {
      name: req.body.name,
      about: req.body.about,
    }, { runValidators: true, new: true });
    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(ERROR_CODE_USER).send({ message: message400 });
    } else if (err.name === 'ValidationError') {
      res.status(ERROR_CODE_USER).send({ message: err.message });
    } else {
      res.status(ERROR_CODE_SERVER).send({ message: message500 });
    }
  }
};

const updateAvatarUser = async (req, res) => {
  try {
    const avatar = await User.findByIdAndUpdate(req.user._id, {
      avatar: req.body.avatar,
    }, { runValidators: true, new: true });
    res.send(avatar);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(ERROR_CODE_USER).send({ message: message400 });
    } else if (err.name === 'ValidationError') {
      res.status(ERROR_CODE_USER).send({ message: err.message });
    } else {
      res.status(ERROR_CODE_SERVER).send({ message: message500 });
    }
  }
};

module.exports = {
  getUsers, getUser, createUser, updateUser, updateAvatarUser, login, getCurrentUser
};
