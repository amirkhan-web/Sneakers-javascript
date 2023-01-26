import { btnDropdown } from '../scripts/dropdown';
import { btnsGender } from '../scripts/gender';
import { details } from '../scripts/selectors';

const methodsUrl = {
  items: 'http://localhost:3001/items?',
  cart: 'http://localhost:3001/cart',
  users: 'http://localhost:3001/users',
};

export const dataFilter = [
  {
    selector: btnDropdown,
    filter: '',
    event: 'click',
  },
  {
    selector: !details ? btnsGender : null,
    filter: '',
    event: 'click',
  },
];

export const apiData = {
  async getItems(callback, value) {
    try {
      const filteringList =
        methodsUrl.items +
        `${
          dataFilter[0].filter
            ? `_sort=price&_order=${dataFilter[0].filter}`
            : ''
        }${dataFilter[1].filter ? `${`&gender=${dataFilter[1].filter}`}` : ''}`;

      return await fetch(filteringList)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Error:', res.status);
          }

          return res.json();
        })
        .then((data) => {
          if (value) {
            return data;
          } else {
            return callback(data);
          }
        });
    } catch (error) {
      console.log('Error:', error);
    }
  },
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
  async getDataPage(callback, value) {
    try {
      return await apiData.getItems(callback, value).then((data) => {
        if (value) {
          return callback(data.filter((item) => item.id === value));
        } else {
          return callback(data);
        }
      });
    } catch (error) {
      console.log('Error', error);
    }
  },
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
