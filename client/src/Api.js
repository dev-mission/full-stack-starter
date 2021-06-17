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
  sections: {
    index() {
      return instance.get('/api/sections');
    },
    create(data) {
      return instance.post('/api/sections', data);
    },
    get(id) {
      return instance.get(`/api/sections/${id}`);
    },
    update(id, data) {
      return instance.patch(`/api/sections/${id}`, data);
    },
    delete(id) {
      return instance.delete(`/api/sections/${id}`);
    },
  },
  sectionItems: {
    index() {
      return instance.get('/api/sectionItems');
    },
    create(data) {
      return instance.post('/api/sectionItems', data);
    },
    get(id) {
      return instance.get(`/api/sectionItems/${id}`);
    },
    update(id, data) {
      return instance.patch(`/api/sectionItems/${id}`, data);
    },
    delete(id) {
      return instance.delete(`/api/sectionItems/${id}`);
    },
  },
  users: {
    me() {
      return instance.get('/api/users/me');
    },
    update(id, data) {
      return instance.patch(`/api/users/${id}`, data);
    },
  },
};

export default Api;
