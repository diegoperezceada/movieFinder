const { getLanguage, sendJson, tmdbRequest } = require('../_lib/tmdb');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  try {
    const data = await tmdbRequest('/movie/popular', {
      language: getLanguage(req),
    });

    return sendJson(res, 200, data);
  } catch (error) {
    return sendJson(res, error.statusCode || 500, {
      error: error.message,
      details: error.payload,
    });
  }
};
