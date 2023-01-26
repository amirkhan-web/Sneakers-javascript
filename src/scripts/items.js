import { lists, details, bonuses } from './selectors';

import { apiData, dataFilter } from '../api/api';
import { renderDocumentList } from '../utils/renderDocumentList';

let hash = location.hash.substring(1);

export const renderCard = (data) => {
  if (lists) {
    !details ? (lists.innerHTML = '') : null;

    data.forEach((item) => {
      const listsItem = renderDocumentList('li', ['lists__item'], item.id);

      listsItem.innerHTML = `
          <div>
            <img class='lists__item-image' width="200px" height="200px" src="${item.images}">
          <div/>
          <a class='lists__item-name' href="details.html#${item.id}">${item.name}</a>
          <p class='lists__item-price'>${item.price} р.</p>
          <button class='lists__item-add'>Добавить</button>
        `;

      !details ? lists.insertAdjacentElement('beforeend', listsItem) : null;

      return lists;
    });

    const price = lists.querySelectorAll('.lists__item-price');

    !details
      ? bonuses.forEach((bonus) => {
          bonus.addEventListener('input', () => {
            price.forEach((p) => {
              if (bonus.checked) {
                const currentPrice =
                  parseFloat(p.textContent) * parseFloat(bonus.value);

                !details ? (p.textContent = currentPrice + ' р.') : null;
              } else if (!bonus.checked) {
                const currentPrice =
                  parseFloat(p.textContent) / parseFloat(bonus.value);

                !details ? (p.textContent = currentPrice + ' р.') : null;
              }
            });
          });
        })
      : null;
  }
};

const data = apiData.getItems(renderCard);

const eventListenerFiltered = (currentData) => {
  currentData.map((item) => {
    if (!details) {
      if (item.event === 'click') {
        Array.prototype.forEach.call(item.selector, (node) => {
          node.addEventListener('click', () => {
            item.filter = node.getAttribute('data-value');
            apiData.getItems(renderCard);
          });
        });
      }
    }
  });

  return currentData;
};

eventListenerFiltered(dataFilter);

window.addEventListener('hashchange', () => {
  hash = location.hash.substring(1);
});
