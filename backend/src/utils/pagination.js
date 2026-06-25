'use strict';

/**
 * Parse and validate pagination query params.
 * @param {object} query - req.query
 * @returns {{ limit: number, offset: number, page: number }}
 */
const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

/**
 * Build a standard paginated response envelope.
 */
const paginatedResponse = (data, count, page, limit) => ({
  success: true,
  data,
  pagination: {
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
    hasNext: page * limit < count,
    hasPrev: page > 1,
  },
});

module.exports = { getPagination, paginatedResponse };
