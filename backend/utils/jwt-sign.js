const jwt = require('jsonwebtoken');

const jwtSign = (id) => {
  return jwt.sign({ id }, 'eat_the_peach', { expiresIn: '7d'}); //todo
}

module.exports = jwtSign;
