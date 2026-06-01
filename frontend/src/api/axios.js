import axios from 'axios';

let apiURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Clean trailing slashes
apiURL = apiURL.replace(/\/+$/, '');

// Ensure the URL ends with /api
if (!apiURL.endsWith('/api')) {
  apiURL = apiURL + '/api';
}

// Upgrade http to https for non-localhost/non-IP targets to prevent Mixed Content Block on secure deployments
if (apiURL.startsWith('http://') && !apiURL.includes('localhost') && !apiURL.includes('127.0.0.1')) {
  apiURL = apiURL.replace('http://', 'https://');
}

const instance = axios.create({
  baseURL: apiURL,
});

instance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
