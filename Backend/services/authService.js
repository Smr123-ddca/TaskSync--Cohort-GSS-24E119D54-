const { query } = require('../db/index');
const { hashPassword, comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');

async function registerUser({ username, email, password }) {
  const passwordHash = await hashPassword(password);

  const result = await query(
    `INSERT INTO users (username, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, username, email, created_at`,
    [username, email, passwordHash]
  );

  return result.rows[0];
}

async function verifyCredentials({ email, password }) {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];

  if (!user) {
    return null;
  }

  const passwordMatches = await comparePassword(password, user.password_hash);
  return passwordMatches ? user : null;
}

function createToken(user) {
  return signToken(user);
}

module.exports = { registerUser, verifyCredentials, createToken };