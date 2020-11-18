const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUser, createUser, updateUser, updateAvatarUser,
} = require('../controllers/users.js');

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().pattern(/^https?:\/\/(www\.)?[\w-.~:/?#[\]@!$&'()*+,;=]+#?$/i),
  }),
}), createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatarUser);

module.exports = router;
