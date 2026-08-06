const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

function hashPassword(Password) {
  return bcrypt.hash(Password, SALT_ROUNDS);
}

function comparePassword(Password, passwordHash) {
  return bcrypt.compare(Password, passwordHash);
}

module.exports = { hashPassword, comparePassword };