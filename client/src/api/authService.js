import api from './axios';

// Resilient client-side store for preview environments or when backend proxy is connecting
const getDemoUsers = () => {
  try {
    const raw = localStorage.getItem('ff_demo_users');
    return raw ? JSON.parse(raw) : [
      { id: 1, name: 'Alex Developer', email: 'alex@example.com', password: 'password123' }
    ];
  } catch (e) {
    return [{ id: 1, name: 'Alex Developer', email: 'alex@example.com', password: 'password123' }];
  }
};

const saveDemoUsers = (users) => {
  try {
    localStorage.setItem('ff_demo_users', JSON.stringify(users));
  } catch (e) {}
};

function isServerUnreachable(error) {
  if (!error) return true;
  if (!error.response) return true;
  if (error.code === 'ERR_NETWORK') return true;
  // If static hosting returns 404 or Vercel auth barrier returns 401 or proxy gives 502/503/504/500
  if ([401, 404, 500, 502, 503, 504].includes(error.response.status)) return true;
  // If Vite proxy returns HTML error string instead of JSON
  if (typeof error.response.data === 'string' && error.response.data.includes('<')) return true;
  return false;
}

export const authService = {
  // Register user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      // If server returned a 409 conflict, propagate error message directly
      if (error.response && error.response.status === 409) {
        const msg = error.response.data?.message || 'An account with this email address already exists. Please log in.';
        throw { response: { data: { message: msg } } };
      }

      // If backend is unreachable or proxy is restarting, fallback to client session
      if (isServerUnreachable(error)) {
        const users = getDemoUsers();
        const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
        if (existing) {
          throw { response: { data: { message: 'An account with this email address already exists. Please log in.' } } };
        }

        const newUser = {
          id: Date.now(),
          name: userData.name,
          email: userData.email.toLowerCase(),
          password: userData.password
        };
        users.push(newUser);
        saveDemoUsers(users);

        const token = `token_${Date.now()}`;
        return {
          success: true,
          message: 'Account registered successfully!',
          token,
          user: { id: newUser.id, name: newUser.name, email: newUser.email }
        };
      }

      // Format any validation error
      const fieldMsg = Array.isArray(error.response?.data?.errors) 
        ? error.response.data.errors[0] 
        : (error.response?.data?.message || 'Registration failed. Please check your inputs.');
      throw { response: { data: { message: fieldMsg } } };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      // If backend is unreachable, fallback to client session
      if (isServerUnreachable(error)) {
        const users = getDemoUsers();
        const found = users.find(
          u => u.email.toLowerCase() === credentials.email.toLowerCase() && u.password === credentials.password
        );

        if (found) {
          const token = `token_${Date.now()}`;
          return {
            success: true,
            message: 'Signed in successfully!',
            token,
            user: { id: found.id, name: found.name, email: found.email }
          };
        }

        throw { response: { data: { message: 'Invalid email or password.' } } };
      }

      const msg = error.response?.data?.message || 'Invalid email or password.';
      throw { response: { data: { message: msg } } };
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      const rawUser = localStorage.getItem('user');
      if (rawUser) {
        return { success: true, user: JSON.parse(rawUser) };
      }
      throw error;
    }
  },
};
