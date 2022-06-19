const User = require('../models/user');

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
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
          .send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Внутренняя ошибка сервера' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(404)
          .send({ message: `Переданы некорректные данные при создании пользователя - ${err.message}` });
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
      /*
      if (err.name === 'ValidationError') {
        return res.status(404)
          .send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      */
      if (err.name === 'CastError') {
        return res.status(400)
          .send({ message: 'Пользователь по указанному _id не найден' });
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
      /*
        if (err.name === 'ValidationError') {
          return res.status(404)
            .send({ message: 'Переданы некорректные данные при обновлении аватара' });
        }
      */
      if (err.name === 'CastError') {
        return res.status(400)
          .send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};
