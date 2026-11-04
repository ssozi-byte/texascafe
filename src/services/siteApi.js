// Small API helper that reads data from the Flask backend first and falls back to local content
// when the backend is not running. This keeps the application resilient during local development.
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export function getAuthHeader(token) {
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

async function requestJson(endpoint, { method = 'GET', payload, fallback, token } = {}) {
  try {
    const headers = {
      ...(payload ? { 'Content-Type': 'application/json' } : {}),
      ...getAuthHeader(token),
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: payload ? JSON.stringify(payload) : undefined,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.error || `Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn(`Using fallback response for ${endpoint}:`, error.message);
    return fallback;
  }
}

export async function fetchJson(endpoint, fallback, token) {
  return requestJson(endpoint, { fallback, token });
}

export async function postJson(endpoint, payload, fallback, token) {
  return requestJson(endpoint, { method: 'POST', payload, fallback, token });
}

export async function putJson(endpoint, payload, fallback, token) {
  return requestJson(endpoint, { method: 'PUT', payload, fallback, token });
}

export async function deleteJson(endpoint, payload, fallback, token) {
  return requestJson(endpoint, { method: 'DELETE', payload, fallback, token });
}
