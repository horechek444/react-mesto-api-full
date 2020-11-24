const jwt = require('jsonwebtoken');

const jwtSign = (id) => jwt.sign({ id }, 'eat_the_peach', { expiresIn: '7d' }); // todo

module.exports = jwtSign;
