const url = 'http://localhost:3001/items?';

const lists = document.querySelector('ul');
const filterSelectorPrice = document.querySelector('.select-price');
const filterSelectorCategory = document.querySelector('.select-category');
const filterSelectorGender = document.querySelector('.select-gender');
const filterSearchInput = document.querySelector('.sneakers-search');

let filterPrice = '';
let filterCategory = '';
let filterGender = '';
let filterSearch = '';

const getItems = async () => {
  const filteringList =
    url +
    `${filterCategory ? `category=${filterCategory}` : ''}${
      filterPrice ? `&_sort=price&_order=${filterPrice}` : ''
    }${filterGender ? `&gender=${filterGender}` : ''}${
      filterSearch ? `&q=${filterSearch}` : ''
    }`;

  lists.innerHTML = '';
  return await fetch(filteringList)
    .then((res) => res.json())
    .then((data) => {
      data.forEach(({ name, price, images, gender }) => {
        const listItem = document.createElement('li');
        listItem.classList.add('lists__item');

        listItem.innerHTML = `
          <div>
            <img width="200px" height="200px" src="${images}">
          </div>
          <span>${name}</span>
          <div>
            <span>${gender === 'men' ? 'мужской' : 'женский'}</span>
          </div>
          <p>${price} р.</p>
          <button>Добавить</button>
        `;

        lists.insertAdjacentElement('beforeend', listItem);
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

filterSelectorPrice.addEventListener('change', (event) => {
  filterPrice = event.target.value;
  getItems();
});

filterSelectorCategory.addEventListener('change', (event) => {
  filterCategory = event.target.value;
  getItems();
});

filterSelectorGender.addEventListener('change', (event) => {
  filterGender = event.target.value;
  getItems();
});

filterSearchInput.addEventListener('keyup', (event) => {
  filterSearch = event.target.value;
  getItems();
});

getItems();
