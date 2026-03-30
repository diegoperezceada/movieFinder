const BASE_URL = 'https://api.themoviedb.org/3';

function getAuthHeaders() {
  const readAccessToken = process.env.TMDB_READ_ACCESS_TOKEN;

  if (readAccessToken) {
    return {
      Authorization: `Bearer ${readAccessToken}`,
    };
  }

  return null;
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

async function tmdbRequest(pathname, searchParams = {}) {
  const headers = getAuthHeaders();
  const apiKey = process.env.TMDB_API_KEY;

  if (!headers && !apiKey) {
    const error = new Error(
      'Missing TMDB credentials. Set TMDB_READ_ACCESS_TOKEN or TMDB_API_KEY in Vercel.',
    );
    error.statusCode = 500;
    throw error;
  }

  const url = new URL(`${BASE_URL}${pathname}`);

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  if (!headers && apiKey) {
    url.searchParams.set('api_key', apiKey);
  }

  const response = await fetch(url, {
    headers: {
      ...(headers || {}),
      accept: 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.status_message || 'TMDB request failed');
    error.statusCode = response.status;
    error.payload = data;
    throw error;
  }

  return data;
}

function getLanguage(req) {
  const language = req.query?.language;

  if (language === 'es-ES' || language === 'en-US') {
    return language;
  }

  return 'es-ES';
}

function getId(req) {
  const id = req.query?.id;

  if (!id || !/^\d+$/.test(String(id))) {
    return null;
  }

  return String(id);
}

function getSearchQuery(req) {
  const query = String(req.query?.query || '').trim();

  if (query.length < 1) {
    return null;
  }

  return query;
}

module.exports = {
  getId,
  getLanguage,
  getSearchQuery,
  sendJson,
  tmdbRequest,
};
