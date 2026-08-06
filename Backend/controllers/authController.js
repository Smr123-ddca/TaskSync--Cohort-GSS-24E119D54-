const authService = require('../services/authService.js');
const { setAuthCookie, clearAuthCookie } = require('../utils/jwt.js');

async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'username, email and password are required' });
    }

    const user = await authService.registerUser({ username, email, password });
    res.status(201).json({ user });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Username or email already in use' });
    }
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const user = await authService.verifyCredentials({ email, password });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = authService.createToken(user);
    setAuthCookie(res, token);
    res.json({ user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    next(err);
  }
}

function logout(req, res) {
  clearAuthCookie(res);
  res.status(204).send();
}

module.exports = { register, login, logout };