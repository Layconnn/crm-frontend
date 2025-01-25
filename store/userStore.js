import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: null,
    userId: null,
    users: [] // Store users fetched from the backend
  }),

  actions: {
    setUser(userData) {
      this.user = userData;
      this.token = userData.token;
      this.userId = userData.userId;
      localStorage.setItem('user', JSON.stringify(userData));
    },

    loadUser() {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.user = JSON.parse(storedUser);
        this.token = this.user.token;
        this.userId = this.user.userId;
      } else {
        console.warn("No user found in localStorage.");
      }
    },

    logout(router) {
      this.user = null;
      this.token = null;
      this.userId = null;
      localStorage.removeItem('user');

      if (router) {
        router.push('/login');
      } else {
        console.warn('Router not provided for logout redirection.');
      }
    },

    async fetchUsers() {
      try {
        const response = await fetch('http://localhost:5001/api/users', {
          method: 'GET',
          headers: {
           'Authorization': `Bearer ${localStorage.getItem('user').token}`, // Ensure you're passing the token for authentication if needed
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        this.users = data;
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
  },
});
