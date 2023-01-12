window.addEventListener('DOMContentLoaded', () => {
  const urlItems = 'http://localhost:3001/items?';
  const urlCart = 'http://localhost:3001/cart';

  const genderArray = [
    { name: 'Мужские', gen: 'men' },
    { name: 'Женские', gen: 'women' },
  ];

  const renderDocumentList = (tag, className = [], typeId) => {
    const node = document.createElement(tag);

    if (className.length) {
      node.classList.add(...className);
    }

    if (typeId) {
      node.id = typeId;
    }

    return node;
  };

  const lists = document.querySelector('ul');
  const selectPrice = document.querySelector('.select-price');
  const selectCategory = document.querySelector('.select-category');
  const gender = document.querySelector('.gender');
  const details = document.querySelector('.details__data');
  const cart = document.querySelector('.cart');
  const cartBtn = document.querySelector('.cart__btn');
  const searchForm = document.querySelector('.search-form__item');
  const searchList = document.querySelector('.search-list');

  const renderGender = () => {
    return genderArray
      .map(
        (g) =>
          `<button data-value=${g.gen} class='gender__item'>${g.name}</button>`
      )
      .join('');
  };

  !details ? gender.insertAdjacentHTML('beforeend', renderGender()) : null;

  const btnsGender = !details ? gender.querySelectorAll('.gender__item') : '';

  let hash = location.hash.substring(1);

  const data = [
    {
      selector: selectPrice,
      filter: '',
      event: 'change',
    },
    {
      selector: selectCategory,
      filter: '',
      event: 'change',
    },
    {
      selector: !details ? btnsGender : null,
      filter: '',
      event: 'click',
    },
  ];

  let cartData = [];

  const fetchData = async () => {
    const filteringList =
      urlItems +
      `${data[0].filter ? `_sort=price&_order=${data[0].filter}` : ''} ${
        data[1].filter ? `${`&category=${data[1].filter}`}` : ''
      } ${data[2].filter ? `${`&gender=${data[2].filter}`}` : ''}`;

    try {
      return await fetch(filteringList).then((res) => {
        if (!res.ok) {
          throw Error('Error');
        }
        return res.json();
      });
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const contains = async (query) => {
    return await fetchData(urlItems).then((data) =>
      data.filter((item) => {
        return item.name.toLowerCase().includes(query.toLowerCase());
      })
    );
  };

  const server = {
    search({ target }) {
      const { value } = target;

      return new Promise((res) => {
        setTimeout(
          () =>
            res({
              list: value
                ? contains(value).then((data) => {
                    const html = data
                      .map((item) => {
                        return `<li>${item.name}</li>`;
                      })
                      .join('');
                    searchList.innerHTML = html;
                  })
                : [],
            }),
          100
        );
      });
    },
  };

  function debounce(callee, timeoutMs) {
    return function perform(...args) {
      let previousCall = this.lastCall;

      this.lastCall = Date.now();

      if (previousCall && this.lastCall - previousCall <= timeoutMs) {
        clearTimeout(this.lastCallTimer);
      }
      this.lastCallTimer = setTimeout(() => callee(...args), timeoutMs);
    };
  }

  const debouncedHandle = debounce(server.search, 250);

  !details ? searchForm.addEventListener('input', debouncedHandle) : null;

  const fetchCart = () => {
    return new Promise((res, rej) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', urlCart);

      xhr.responseType = 'json';

      xhr.onload = () => {
        if (xhr.status !== 200) {
          rej('Error:', xhr.statusText);
        } else {
          res(xhr.response);
        }
      };

      xhr.send();
    });
  };

  const renderCard = (data) => {
    lists.innerHTML = '';

    data.map((item) => {
      const listsItem = renderDocumentList('li', ['lists__item'], item.id);

      listsItem.innerHTML = `
        <div>
          <img class='lists__item-image' width="200px" height="200px" src="${item.images}">
        <div/>
        <a class='lists__item-name' href="/details.html#${item.id}">${item.name}</a>
        <p class='lists__item-price'>${item.price} р.</p>
        <button class='lists__item-add'>Добавить</button>
      `;

      lists.insertAdjacentElement('beforeend', listsItem);
    });
  };

  const getDataPage = async (callback, value) => {
    try {
      await fetchData(urlItems).then((data) => {
        if (value) {
          callback(data.filter((item) => item.id === value));
        } else {
          return renderCard(data);
        }
      });
    } catch (error) {
      console.log('Error', error);
    }
  };

  const renderDetailsPage = (data) => {
    data.forEach((item) => {
      const detailsItem = renderDocumentList('li', ['details__item'], item.id);
      detailsItem.innerHTML = `
        <div>
          <img class='details__image' width="400px" height="400px" src="${
            item.images
          }">
          <div>
            ${item.allImages
              .map(
                (el) =>
                  `<img class='details__image-all' width="120px" height="120px" src="${el}">`
              )
              .join(' ')}
          </div>
        </div>
        <div>
          <span>${item.name}</span>
          <p>${item.price}р.</p>
        </div>
      `;

      details.insertAdjacentElement('beforeend', detailsItem);
      const detailsImageAll = document.querySelectorAll('.details__image-all');
      detailsImageAll.forEach((elImg) => {
        elImg.addEventListener('mouseover', () => {
          if (elImg.matches('.details__image-all')) {
            const srcImage = elImg.src;
            document.querySelector('.details__image').src = srcImage;

            detailsImageAll.forEach((el) =>
              el.classList.remove('details__image-all--active')
            );

            elImg.classList.add('details__image-all--active');
          }
        });
      });
    });
  };

  getDataPage(renderDetailsPage, hash);

  window.addEventListener('hashchange', () => {
    hash = location.hash.substring(1);
  });

  const renderCart = (data) => {
    cart.innerHTML = '';
    cart.insertAdjacentHTML(
      'beforeend',
      `
      <div class='cart__inner'></div>
    `
    );

    const cartClose = renderDocumentList('button');
    cartClose.textContent = 'close';

    cart.querySelector('.cart__inner').addEventListener('click', (event) => {
      event.stopPropagation();
    });

    cartClose.addEventListener('click', () => {
      cart.classList.remove('active');
    });

    data.forEach((item) => {
      const cartItem = renderDocumentList('div', ['cart__item'], item.id);
      cartItem.innerHTML = `
        <span>${item.name}</span>
        <p>${item.price} р.</p>
        <img width="120px" height="120px" src="${item.images}">
        <button class='cart__remove'>Удалить</button>
      `;

      cart.querySelector('.cart__inner').prepend(cartClose);
      cart.querySelector('.cart__inner').append(cartItem);
    });
  };

  cartBtn.addEventListener('click', () => {
    cart.classList.toggle('active');
  });

  const eventListenerFiltered = (currentData) => {
    currentData.map((item) => {
      if (!details) {
        if (item.event === 'click') {
          Array.prototype.forEach.call(item.selector, (node) => {
            node.addEventListener('click', () => {
              item.filter = node.getAttribute('data-value');
              getDataPage();
            });
          });
        } else if (item.event === 'change') {
          item.selector.addEventListener('change', (event) => {
            item.filter = event.target.value;
            getDataPage();
          });
        }
      }
    });

    return currentData;
  };

  eventListenerFiltered(data);

  const addToCart = (event) => {
    if (event.target.matches('.lists__item-add')) {
      const parentNode = event.target.closest('.lists__item');
      const id = parentNode.id;
      const name = parentNode.querySelector('.lists__item-name').textContent;
      const price = parentNode.querySelector('.lists__item-price').textContent;
      const images = parentNode.querySelector('.lists__item-image').src;

      const count = 1;

      const newItem = {
        id,
        name,
        price: parseInt(price),
        images,
        count,
      };

      const foundItems = cartData.find((item) => item.id === id);

      if (foundItems) {
        cartData.map((cart) =>
          cart.id === id ? { ...cart, count: cart.count + 1 } : cart
        );
      } else {
        const xhr = new XMLHttpRequest();

        cartData.push(newItem);

        xhr.open('POST', 'http://localhost:3001/cart', true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        const body = JSON.stringify(newItem);

        xhr.onload = () => {
          if (xhr.status === 201) {
            fetchCart().then((data) => renderCart(data));
          } else {
            console.log('Error', `${xhr.statusText} ${xhr.status}`);
          }
        };

        xhr.send(body);
      }
    }
  };

  const removeCart = async ({ target }) => {
    if (target.matches('.cart__remove')) {
      const parentNode = target.closest('.cart__item');
      const id = parentNode.id;

      cartData = cartData.filter((item) => item.id !== id);

      await fetch(`${urlCart}/${id}`, {
        method: 'DELETE',
      });

      parentNode.remove();
    }
  };

  fetchCart().then((data) => renderCart(data));

  document.addEventListener('click', () => {
    cart.classList.remove('active');
  });

  !details ? lists.addEventListener('click', addToCart) : null;
  !details ? cart.addEventListener('click', removeCart) : null;
});
