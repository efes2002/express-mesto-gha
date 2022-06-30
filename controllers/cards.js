const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'Внутренняя ошибка сервера' }));
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400)
          .send({ message: `Переданы некорректные данные - ${err.message}` });
      } return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.id).then((card) => {
    if (!card) {
      res.status(404)
        .send({ message: 'Карточка не найдена' });
    } else if (card.owner.toString() === req.user._id) {
      Card.findByIdAndRemove(req.params.id)
        .then((item) => {
          if (!item) {
            res.status(404)
              .send({ message: 'Карточка не найдена' });
          } else {
            res.send(item);
          }
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            return res.status(400)
              .send({ message: 'Переданы некорректные данные' });
          }
          return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
        });
    } else {
      res.status(400).send({ message: 'Переданы некорректные данные' });
    }
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400)
          .send({ message: 'Переданы некорректные данные' });
      } return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404)
          .send({ message: 'Карточка не найдена' });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400)
          .send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404)
          .send({ message: 'Карточка не найдена' });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400)
          .send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};
