const router = require('express').Router();
const {
  getUsers, getUser, updateUser, updateAvatarUser, getCurrentUser,
} = require('../controllers/users.js');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:id', getUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatarUser);

module.exports = router;
