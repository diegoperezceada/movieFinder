const {
  getId,
  getLanguage,
  sendJson,
  tmdbRequest,
} = require('../_lib/tmdb');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const id = getId(req);

  if (!id) {
    return sendJson(res, 400, { error: 'Invalid movie id' });
  }

  try {
    const data = await tmdbRequest(`/movie/${id}`, {
      language: getLanguage(req),
      append_to_response: 'credits,watch/providers',
    });

    return sendJson(res, 200, data);
  } catch (error) {
    return sendJson(res, error.statusCode || 500, {
      error: error.message,
      details: error.payload,
    });
  }
};
