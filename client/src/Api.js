import axios from 'axios';

const instance = axios.create({
  headers: {
    Accept: 'application/json',
  },
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      window.location = '/login';
    }
    return Promise.reject(error);
  }
);

const Api = {
  assets: {
    create(data) {
      return instance.post('/api/assets', data);
    },
    upload(url, headers, file) {
      return instance.put(url, file, { headers });
    },
  },
  auth: {
    login(email, password) {
      return instance.post('/api/auth/login', { email, password });
    },
    logout() {
      return instance.get('/api/auth/logout');
    },
    register(data) {
      return instance.post('/api/auth/register', data);
    },
  },
  invites: {
    index() {
      return instance.get(`/api/invites`);
    },
    create(data) {
      return instance.post('/api/invites', data);
    },
    get(id) {
      return instance.get(`/api/invites/${id}`);
    },
    accept(id, data) {
      return instance.post(`/api/invites/${id}/accept`, data);
    },
    resend(id) {
      return instance.post(`/api/invites/${id}/resend`);
    },
    revoke(id) {
      return instance.delete(`/api/invites/${id}`);
    },
  },
  passwords: {
    reset(email) {
      return instance.post('/api/passwords', { email });
    },
    get(token) {
      return instance.get(`/api/passwords/${token}`);
    },
    update(token, password) {
      return instance.patch(`/api/passwords/${token}`, { password });
    },
  },
  resources: {
    index(TeamId, type, search) {
      return instance.get(`/api/resources`, { params: { TeamId, type, search } });
    },
    create(data) {
      return instance.post('/api/resources', data);
    },
    get(id) {
      return instance.get(`/api/resources/${id}`);
    },
    update(id, data) {
      return instance.patch(`/api/resources/${id}`, data);
    },
  },
  teams: {
    create(data) {
      return instance.post('/api/teams', data);
    },
    get(id) {
      return instance.get(`/api/teams/${id}`);
    },
    update(id, data) {
      return instance.patch(`/api/teams/${id}`, data);
    },
  },
  tours: {
    index(TeamId) {
      return instance.get(`/api/tours`, { params: { TeamId } });
    },
    create(data) {
      return instance.post('/api/tours', data);
    },
    get(id) {
      return instance.get(`/api/tours/${id}`);
    },
    update(id, data) {
      return instance.patch(`/api/tours/${id}`, data);
    },
    resources(id) {
      return {
        index() {
          return instance.get(`/api/tours/${id}/resources`);
        },
        create(data) {
          return instance.post(`/api/tours/${id}/resources`, data);
        },
      };
    },
  },
  users: {
    index() {
      return instance.get(`/api/users`);
    },
    me() {
      return instance.get('/api/users/me');
    },
    get(id) {
      return instance.get(`/api/users/${id}`);
    },
    update(id, data) {
      return instance.patch(`/api/users/${id}`, data);
    },
  },
};

export default Api;
