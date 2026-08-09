const jwt = require('jsonwebtoken');

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  // secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

function signToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

function setAuthCookie(res, token) {
  res.cookie('token', token, COOKIE_OPTIONS);
}

function clearAuthCookie(res) {
  res.clearCookie('token', COOKIE_OPTIONS);
}

module.exports = { signToken, verifyToken, setAuthCookie, clearAuthCookie };