const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

function getToken() {
  return localStorage.getItem('montmell_admin_token');
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || data?.message || `Error ${res.status}`);
  }

  return data;
}

export const api = {
  login: (email, password) =>
    request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  getLicenseStatus: () => request('/api/license/status'),
  activateDemo: () => request('/api/license/demo/activate', { method: 'POST' }),
  listIncidents: () => request('/api/incidents'),
  markSeen: (id) => request(`/api/incidents/${id}/seen`, { method: 'PATCH' }),
  assignIncident: (id, body) =>
    request(`/api/incidents/${id}/assign`, { method: 'PATCH', body: JSON.stringify(body) }),
  updateStatus: (id, body) =>
    request(`/api/incidents/${id}/status`, { method: 'PATCH', body: JSON.stringify(body) }),
};
