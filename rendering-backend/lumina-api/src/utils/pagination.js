/**
 * Parses ?limit & ?skip from query params using the same defaults
 * as dummyjson.com so the Angular ProductService works without change.
 */
const parsePagination = (query) => {
  const limit = Math.max(1, Math.min(parseInt(query.limit) || 30, 100));
  const skip = Math.max(0, parseInt(query.skip) || 0);
  return { limit, skip };
};

module.exports = { parsePagination };
