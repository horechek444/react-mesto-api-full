const jwt = require('jsonwebtoken');

const jwtVerify = async (token) => {
  try {
    return await jwt.verify(token, 'eat_the_peach'); // todo
  } catch (err) {
    return console.log(err);
  }
};

module.exports = jwtVerify;
