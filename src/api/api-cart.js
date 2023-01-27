import { methodsUrl } from './api';

const apiCart = {
  async getCart(callback) {
    try {
      return await fetch(methodsUrl.cart)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Error:', res.status);
          }

          return res.json();
        })
        .then((data) => callback(data));
    } catch (error) {
      console.log('Error:', error);
    }
  },
  async addToCart(items) {
    try {
      await fetch(methodsUrl.cart, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(items),
      }).then((data) => data);
    } catch (error) {
      console.log('Error:', error);
    }
  },
  async removeCart(id) {
    try {
      fetch(`${methodsUrl.cart}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.log('Error:', error);
    }
  },
  async updateCount(id, count) {
    try {
      fetch(`${methodsUrl.cart}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count: count + 1 }),
      });
    } catch (error) {
      console.log('Error:', error);
    }
  },
  async updateCountPlus(id, count) {
    try {
      fetch(`${methodsUrl.cart}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count: count + 1 }),
      });
    } catch (error) {
      console.log('Error:', error);
    }
  },
  async updateCountMinus(id, count) {
    try {
      fetch(`${methodsUrl.cart}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count: count - 1 }),
      });
    } catch (error) {
      console.log('Error:', error);
    }
  },
};

export const {
  getCart,
  addToCart,
  removeCart,
  updateCount,
  updateCountPlus,
  updateCountMinus,
} = apiCart;
