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
    return sendJson(res, 400, { error: 'Invalid actor id' });
  }

  try {
    const data = await tmdbRequest(`/person/${id}`, {
      language: getLanguage(req),
      append_to_response: 'combined_credits',
    });

    return sendJson(res, 200, data);
  } catch (error) {
    return sendJson(res, error.statusCode || 500, {
      error: error.message,
      details: error.payload,
    });
  }
};
