import apiClient from './client';

// PUBLIC_INTERFACE
/**
 * Users API module providing CRUD methods.
 * Each method returns parsed JSON or throws a normalized Error from apiClient.
 *
 * Endpoints (expected):
 * - GET    /users            -> list users
 * - GET    /users/:id        -> get user by id
 * - POST   /users            -> create user (body: { name, email, role, bio? })
 * - PUT    /users/:id        -> update user
 * - DELETE /users/:id        -> delete user
 */
const usersApi = {
  // PUBLIC_INTERFACE
  async list() {
    return apiClient.get('/users');
  },
  // PUBLIC_INTERFACE
  async getById(id) {
    return apiClient.get(`/users/${encodeURIComponent(id)}`);
  },
  // PUBLIC_INTERFACE
  async create(payload) {
    return apiClient.post('/users', { data: payload });
  },
  // PUBLIC_INTERFACE
  async update(id, payload) {
    return apiClient.put(`/users/${encodeURIComponent(id)}`, { data: payload });
  },
  // PUBLIC_INTERFACE
  async remove(id) {
    return apiClient.delete(`/users/${encodeURIComponent(id)}`);
  }
};

export default usersApi;
