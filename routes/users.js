const router = require('express').Router();
const {
  getUser,
  getUsers,
  getUserMe,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.get('/users/me', getUserMe);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
