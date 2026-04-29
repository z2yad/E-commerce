const jwt = require('jsonwebtoken');

const jwtConfig = {
  accessSecret: process.env.JWT_ACCESS_SECRET,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  accessExpires: process.env.JWT_ACCESS_EXPIRES || '15m',
  refreshExpires: process.env.JWT_REFRESH_EXPIRES || '7d',
};

const signAccessToken = (payload) =>
  jwt.sign(payload, jwtConfig.accessSecret, { expiresIn: jwtConfig.accessExpires });

const signRefreshToken = (payload) =>
  jwt.sign(payload, jwtConfig.refreshSecret, { expiresIn: jwtConfig.refreshExpires });

const verifyAccessToken = (token) =>
  jwt.verify(token, jwtConfig.accessSecret);

const verifyRefreshToken = (token) =>
  jwt.verify(token, jwtConfig.refreshSecret);

module.exports = {
  jwtConfig,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
