const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

function getUserById(req, res, id) {
  return User.findById(id)
    .then((user) => {
      if (!user) {
        res.status(404)
          .send({ message: 'Пользователь не найден' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400)
          .send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
}

module.exports.getUser = (req, res) => {
  const id = req.params.userId;
  return getUserById(req, res, id);
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Внутренняя ошибка сервера' }));
};

module.exports.getUserMe = (req, res) => {
  const id = req.user._id;
  return getUserById(req, res, id);
};

module.exports.createUser = (req, res) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400)
          .send({ message: `Переданы некорректные данные - ${err.message}` });
      } return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.updateProfile = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(404)
          .send({ message: 'Пользователь не найден' });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400)
          .send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        res.status(404)
          .send({ message: 'Пользователь не найден' });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400)
          .send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return res.status(401)
          .send({ message: 'Неправильные почта или пароль' });
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            res.status(401)
              .send({ message: 'Неправильные почта или пароль' });
          } else {
            const token = jwt.sign(
              { _id: user._id },
              'some-secret-key',
              { expiresIn: '7d' },
            );
            res.status(200)
              .cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true })
              .send({ message: 'Всё верно!' });
          }
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400)
          .send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};
