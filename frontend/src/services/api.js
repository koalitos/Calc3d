import { API_BASE_URL } from '../config';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth
  async login(username, password) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async register(username, password, email) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, email }),
    });
  }

  // Filamentos
  async getFilamentos() {
    return this.request('/api/filamentos');
  }

  async createFilamento(data) {
    return this.request('/api/filamentos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateFilamento(id, data) {
    return this.request(`/api/filamentos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteFilamento(id) {
    return this.request(`/api/filamentos/${id}`, {
      method: 'DELETE',
    });
  }

  // Máquinas
  async getMaquinas() {
    return this.request('/api/maquinas');
  }

  async createMaquina(data) {
    return this.request('/api/maquinas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMaquina(id, data) {
    return this.request(`/api/maquinas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMaquina(id) {
    return this.request(`/api/maquinas/${id}`, {
      method: 'DELETE',
    });
  }

  // Projetos
  async getProjetos() {
    return this.request('/api/projetos');
  }

  async createProjeto(data) {
    return this.request('/api/projetos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProjeto(id, data) {
    return this.request(`/api/projetos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProjeto(id) {
    return this.request(`/api/projetos/${id}`, {
      method: 'DELETE',
    });
  }

  async calcularProjeto(id) {
    return this.request(`/api/projetos/${id}/calcular`);
  }

  // Health check
  async healthCheck() {
    return this.request('/api/health');
  }
}

const apiService = new ApiService();
export default apiService;
