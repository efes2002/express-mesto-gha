const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const customUrlValidationJoi = require('../utils/customUrlValidationJoi');
const {
  getUser,
  getUsers,
  getUserMe,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUser);

router.get('/users/me', getUserMe);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(customUrlValidationJoi),
  }),
}), updateAvatar);

module.exports = router;
