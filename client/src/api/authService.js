import api from './axios';

// Demo fallback store for static deployments (e.g. Vercel static preview without backend)
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

export const authService = {
  // Register user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      // If backend is unreachable or static hosting 404, fallback to client session
      if (!error.response || error.response.status === 404 || error.response.status === 401) {
        const users = getDemoUsers();
        const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
        if (existing) {
          throw { response: { data: { message: 'An account with this email address already exists.' } } };
        }

        const newUser = {
          id: Date.now(),
          name: userData.name,
          email: userData.email.toLowerCase(),
          password: userData.password
        };
        users.push(newUser);
        saveDemoUsers(users);

        const token = `demo_token_${Date.now()}`;
        return {
          success: true,
          message: 'Account registered successfully!',
          token,
          user: { id: newUser.id, name: newUser.name, email: newUser.email }
        };
      }
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      // If backend is unreachable or static hosting 404, fallback to client session
      if (!error.response || error.response.status === 404 || error.response.status === 401) {
        const users = getDemoUsers();
        const found = users.find(
          u => u.email.toLowerCase() === credentials.email.toLowerCase() && u.password === credentials.password
        );

        if (found) {
          const token = `demo_token_${Date.now()}`;
          return {
            success: true,
            message: 'Signed in successfully!',
            token,
            user: { id: found.id, name: found.name, email: found.email }
          };
        }

        throw { response: { data: { message: 'Invalid email or password.' } } };
      }
      throw error;
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      // Fallback: restore saved session user
      const rawUser = localStorage.getItem('user');
      if (rawUser) {
        return { success: true, user: JSON.parse(rawUser) };
      }
      throw error;
    }
  },
};
