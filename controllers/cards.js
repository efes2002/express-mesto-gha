const Card = require('../models/card');
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(`Переданы некорректные данные - ${err.message}`));
      } return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.id).then((card) => {
    if (!card) {
      next(new NotFoundError('Карточка не найдена'));
    } else if (card.owner.toString() === req.user._id) {
      Card.findByIdAndRemove(req.params.id)
        .then((item) => {
          if (!item) {
            next(new NotFoundError('Карточка не найдена'));
          } else {
            res.send(item);
          }
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            return next(new BadRequestError('Переданы некорректные данные'));
          }
          return next(err);
        });
    } else {
      next(new ForbiddenError('Переданы некорректные данные'));
    }
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      } return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка не найдена'));
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка не найдена'));
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};
