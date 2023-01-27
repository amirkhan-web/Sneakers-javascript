import { methodsUrl } from './api';

const apiLogin = {
  async login(userData) {
    try {
      return await fetch(methodsUrl.users, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      }).then((res) => {
        return res.json();
      });
    } catch (error) {
      console.log('Error:', error);
    }
  },
};

export const { login } = apiLogin;
