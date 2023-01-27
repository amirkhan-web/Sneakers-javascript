import { methodsUrl, dataFilter } from './api';

const apiItems = {
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
  async getDataPage(callback, value) {
    try {
      return await getItems(callback, value).then((data) => {
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
};

export const { getItems, getDataPage } = apiItems;
