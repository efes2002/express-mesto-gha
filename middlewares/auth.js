const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  /*
  const { authorization } = req.headers;
  console.log(1, authorization);
  if (!authorization || !authorization.startsWith('Bearer ')) {
    console.log(2, authorization.startsWith('Bearer '));
    return res.status(401)
      .send({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace('Bearer ', '');
  */

  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401)
      .send({ message: 'Необходима авторизация' });
  }

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  return next();
};
