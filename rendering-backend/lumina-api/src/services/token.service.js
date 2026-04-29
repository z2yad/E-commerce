const { signAccessToken, signRefreshToken, verifyRefreshToken, jwtConfig } = require('../config/jwt');
const RefreshToken = require('../models/refreshToken.model');
const ApiError = require('../utils/ApiError');

/**
 * Creates a JWT access + refresh token pair and persists the
 * refresh token to the DB for revocation support.
 */
const createTokenPair = async (user, req) => {
  const payload = { id: user._id, role: user.role };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // Persist refresh token
  const expiresIn = jwtConfig.refreshExpires; // e.g. '7d'
  const expiresAt = new Date(Date.now() + parseDuration(expiresIn));

  await RefreshToken.findOneAndDelete({ user: user._id, isRevoked: false });
  await RefreshToken.create({
    token: refreshToken,
    user: user._id,
    expiresAt,
    userAgent: req?.headers['user-agent'] || 'unknown',
    ipAddress: req?.ip || 'unknown',
  });

  return { accessToken, refreshToken };
};

/**
 * Validates a refresh token, rotates it, and returns a new pair.
 */
const rotateRefreshToken = async (oldToken, req) => {
  // 1. Decode
  let decoded;
  try {
    decoded = verifyRefreshToken(oldToken);
  } catch {
    throw new ApiError('Invalid or expired refresh token. Please log in again.', 401);
  }

  // 2. Check DB record
  const record = await RefreshToken.findOne({ token: oldToken });
  if (!record || record.isRevoked) {
    // Possible token reuse attack — revoke all tokens for this user
    await RefreshToken.updateMany({ user: decoded.id }, { isRevoked: true });
    throw new ApiError('Refresh token reuse detected. Please log in again.', 401);
  }

  // 3. Revoke old token
  record.isRevoked = true;
  await record.save();

  // 4. Load user and create new pair
  const User = require('../models/user.model');
  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) {
    throw new ApiError('User no longer exists or is deactivated.', 401);
  }

  return createTokenPair(user, req);
};

/**
 * Revoke a specific refresh token (logout).
 */
const revokeRefreshToken = async (token) => {
  await RefreshToken.findOneAndUpdate({ token }, { isRevoked: true });
};

// ── Simple duration string → ms (e.g. '7d' → 7*24*60*60*1000) ───
const parseDuration = (str) => {
  const units = { s: 1000, m: 60000, h: 3600000, d: 86400000, w: 604800000 };
  const match = str.match(/^(\d+)([smhdw])$/);
  if (!match) return 7 * 86400000; // fallback: 7 days
  return parseInt(match[1]) * units[match[2]];
};

module.exports = { createTokenPair, rotateRefreshToken, revokeRefreshToken };
