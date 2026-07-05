const BASE_URL = `${import.meta.env.VITE_APP_API_URL || 'http://localhost:5000'}/api`

const getToken = () => sessionStorage.getItem('token')

export const api = {
  async request(endpoint, options = {}) {
    const token = getToken()
    const headers = { 'Content-Type': 'application/json', ...options.headers }
    if (token) headers.Authorization = `Bearer ${token}`

    const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers })
    const data = await res.json()
    if (res.status === 401) {
      sessionStorage.removeItem('token')
      window.location.href = '/login'
      throw new Error('Session expired')
    }
    if (!res.ok) throw new Error(data.message || 'Request failed')
    return data
  },

  get(endpoint) { return this.request(endpoint) },
  post(endpoint, body) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) }) },
  put(endpoint, body) { return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) }) },
  delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }) },
}
