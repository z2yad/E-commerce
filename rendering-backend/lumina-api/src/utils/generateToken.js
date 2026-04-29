const crypto = require('crypto');

/** Secure random hex token for email verification / password reset. */
const generateRandomToken = () => crypto.randomBytes(32).toString('hex');

/** Hash a plain token for secure storage in DB. */
const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

module.exports = { generateRandomToken, hashToken };
