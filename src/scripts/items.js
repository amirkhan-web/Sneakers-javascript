const lists = document.querySelector('ul');
const gender = document.querySelector('.gender');
const details = document.querySelector('.details__data');
const cart = document.querySelector('.cart');
const cartBtn = document.querySelector('.cart__btn');
const searchForm = document.querySelector('.search-form__item');
const dropdown = document.querySelector('.dropdown');
const days = document.querySelector('.days');
const hours = document.querySelector('.hours');
const minutes = document.querySelector('.minutes');
const seconds = document.querySelector('.seconds');
const modal = document.querySelector('.modal');
const signup = document.querySelector('.signup');
const loginWrapper = document.querySelector('.login-wrapper');
const bonuses = document.querySelectorAll('input[type="checkbox"]');

if (!details) {
  const swiper = new Swiper('.swiper', {
    spaceBetween: 10,
    autoplay: {
      delay: 3000,
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
}

const urlItems = 'http://localhost:3001/items?';
const urlCart = 'http://localhost:3001/cart';
const urlUsers = 'http://localhost:3001/users';

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

const createModal = () => {
  modal.insertAdjacentHTML(
    'beforeend',
    `
    <div class='modal__inner'>
      <div class='modal__content'>
        <h2>Modal</h2>
        <button data-type="close-modal" id="close">Close</button>
      </div>
      <form class='form'>
        <div>
          <input class='form-input form-input-email' type='text' placeholder="Email" width="200px" height="40px">
        </div>
        <div>
          <input class='form-input form-input-password' type='text' placeholder="Password" width="200px" height="40px">
        </div>
        <button>Авторизоваться</button>
      </form>      
    </div>
  `
  );

  !details ? document.body.insertAdjacentElement('beforeend', modal) : null;

  return modal;
};

const login = async (userData) => {
  try {
    return await fetch(urlUsers, {
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
};

const logout = () => {
  localStorage.removeItem('user');
};

const renderModal = () => {
  const modal = createModal();

  const form = modal.querySelector('.form');
  const email = modal.querySelector('.form-input-email');
  const password = modal.querySelector('.form-input-password');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const userData = {
      email: email.value,
      password: password.value,
    };

    if (!userData.email && !userData.password) {
      email.classList.add('form-input--danger');
      password.classList.add('form-input--danger');

      return;
    }

    await login(userData).then((data) => {
      localStorage.setItem('user', JSON.stringify(data));
      modal.classList.remove('active');
      const logoutBtn = renderDocumentList('button', ['logout']);

      signup.textContent = data.email;
      logoutBtn.textContent = 'Выйти';

      data && !details
        ? loginWrapper.insertAdjacentElement('beforeend', logoutBtn)
        : null;
    });
  });

  return {
    open() {
      modal.classList.add('active');
      modal
        .querySelector('.modal__inner')
        .addEventListener('click', (event) => {
          event.stopPropagation();
        });
    },
    close() {
      modal.classList.remove('active');
    },
    outside() {
      modal.addEventListener('click', (event) => {
        if (event.target === modal && modal.matches('.modal')) {
          modal.classList.remove('active');
        }
      });
    },
  };
};

if (!details) {
  const { open, outside } = renderModal();
  signup.addEventListener('click', open);
  document.addEventListener('click', outside);
}

function getUser() {
  return JSON.parse(localStorage.getItem('user') || null);
}

const renderDataFromLocalStorage = () => {
  if (!details) {
    const dataUser = getUser();
    const logoutBtn = renderDocumentList('button', ['logout']);
    logoutBtn.textContent = 'Выйти';

    signup.textContent = dataUser ? dataUser.email : 'Войти';
    dataUser
      ? loginWrapper.insertAdjacentElement('beforeend', logoutBtn)
      : null;

    logoutBtn.addEventListener('click', logout);
  }
};

renderDataFromLocalStorage();

const countDownTimer = () => {
  const daysLeft = new Date().getDay() + 4;
  const hoursLeft = new Date().getHours();
  const minutesLeft = new Date().getMinutes();
  const secondsLeft = new Date().getSeconds();

  days.textContent = daysLeft < 10 ? '0' + daysLeft : daysLeft;
  hours.textContent = hoursLeft < 10 ? '0' + hoursLeft : hoursLeft;
  minutes.textContent = minutesLeft < 10 ? '0' + minutesLeft : minutesLeft;
  seconds.textContent = secondsLeft < 10 ? '0' + secondsLeft : secondsLeft;
};

if (!details) {
  countDownTimer();

  setInterval(countDownTimer, 1000);
}

const dropdownData = [
  { type: '', name: 'По умолчанию' },
  { type: 'asc', name: 'По возврастанию' },
  { type: 'desc', name: 'По убыванию' },
];

const renderDropdown = () => {
  !details
    ? dropdown.insertAdjacentHTML(
        'beforeend',
        `
        <button class="dropdown__btn">По умолчанию</button>
        <div class="dropdown__list">
          ${dropdownData
            .map((d) => {
              return `<span data-value="${d.type}" class="dropdown__list-item">${d.name}</span>`;
            })
            .join('')}
        </div>
      `
      )
    : null;

  return dropdown;
};

const methodsDrpopdown = () => {
  if (!details) {
    const dropdown = renderDropdown();
    const dropdownList = dropdown.querySelector('.dropdown__list');
    const dropdownItems = dropdownList.querySelectorAll('.dropdown__list-item');
    const button = dropdown.querySelector('.dropdown__btn');

    return {
      open() {
        button.addEventListener('click', () => {
          dropdownList.classList.toggle('dropdown__list--active');
        });
      },
      select() {
        dropdownItems.forEach((item) => {
          item.addEventListener('click', () => {
            button.textContent = item.innerHTML;
            dropdownList.classList.remove('dropdown__list--active');
          });
        });
      },
    };
  }
};

if (!details) {
  const { open, select } = methodsDrpopdown();

  [open(), select()];
}

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
const btnDropdown = !details
  ? dropdown.querySelectorAll('.dropdown__list-item')
  : '';

let hash = location.hash.substring(1);

const data = [
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

let cartData = [];

const fetchData = async () => {
  const filteringList =
    urlItems +
    `${data[0].filter ? `_sort=price&_order=${data[0].filter}` : ''}${
      data[1].filter ? `${`&gender=${data[1].filter}`}` : ''
    }`;

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
};

const server = {
  search({ target }) {
    const { value } = target;

    return new Promise((res) => {
      setTimeout(
        () =>
          res({
            list: value ? contains(value).then((data) => renderCard(data)) : [],
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

!details ? searchForm.addEventListener('keydown', debouncedHandle) : null;

const getDataPage = async (callback, value) => {
  try {
    return await fetchData(urlItems).then((data) => {
      if (value) {
        return callback(data.filter((item) => item.id === value));
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

  cartClose.addEventListener('click', () => {
    cart.classList.remove('active');
  });

  data.forEach((item) => {
    const cartItem = renderDocumentList('div', ['cart__item'], item.id);
    cartItem.innerHTML = `
        <span class='cart__name'>${item.name}</span>
        <p class='cart__price'>${item.price} р.</p>
        <div>
          <button class='cart__plus'>+</button>
          <span class='cart__count'>${item.count}</span>
          <button class='cart__minus'>-</button>
        </div>
        <img class='cart__images' width="120px" height="120px" src="${item.images}">
        <button class='cart__remove'>Удалить</button>
      `;

    cart.querySelector('.cart__inner').prepend(cartClose);
    cart.querySelector('.cart__inner').append(cartItem);
  });

  return cart;
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
      }
    }
  });

  return currentData;
};

eventListenerFiltered(data);

const updateCount = async (id, count) => {
  try {
    fetch(`${urlCart}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ count: count + 1 }),
    });
  } catch (error) {
    console.log('Error:', error);
  }
};

const updateCountPlus = async (id, count) => {
  try {
    fetch(`${urlCart}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ count: count + 1 }),
    });
  } catch (error) {
    console.log('Error:', error);
  }
};

const updateCountMinus = async (id, count) => {
  try {
    fetch(`${urlCart}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ count: count - 1 }),
    });
  } catch (error) {
    console.log('Error:', error);
  }
};

const updateCountDataPlus = () => {
  const id = renderCart(cartData).querySelector('.cart__item').id;

  cartData = cartData.map((cart) =>
    cart.id === id ? { ...cart, count: cart.count + 1 } : cart
  );

  return cartData;
};

const updateCountDataMinus = () => {
  const id = renderCart(cartData).querySelector('.cart__item').id;

  cartData = cartData.map((cart) =>
    cart.id === id ? { ...cart, count: cart.count - 1 } : cart
  );

  return cartData;
};

const addToCart = (event) => {
  if (event.target.matches('.lists__item-add')) {
    const parentNode = event.target.closest('.lists__item');
    const id = parentNode.id;
    const name = parentNode.querySelector('.lists__item-name').textContent;
    const price = parentNode.querySelector('.lists__item-price').textContent;
    const images = parentNode.querySelector('.lists__item-image').src;

    let count = 1;

    const newItem = {
      id,
      name,
      price: parseInt(price),
      images,
      count,
    };

    const foundItems = cartData.find((item) => item.id === id);

    if (foundItems) {
      updateCount(id, foundItems.count);

      updateCountDataPlus();

      renderCart(cartData);
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

const updateCountPlusEvent = ({ target }) => {
  if (target.matches('.cart__plus')) {
    const parentNode = target.closest('.cart__item');
    const id = parentNode.id;

    let foundItems = cartData.find((item) => item.id === id);

    updateCountDataPlus();

    updateCountPlus(id, foundItems.count);

    renderCart(cartData);
  }
};

const updateCountMinusEvent = ({ target }) => {
  if (target.matches('.cart__minus')) {
    const parentNode = target.closest('.cart__item');
    const id = parentNode.id;

    let foundItems = cartData.find((item) => item.id === id);

    updateCountDataMinus();

    updateCountMinus(id, foundItems.count);

    renderCart(cartData);
  }
};

fetchCart().then((data) => renderCart(data));

!details ? lists.addEventListener('click', addToCart) : null;
!details ? cart.addEventListener('click', removeCart) : null;
!details ? cart.addEventListener('click', updateCountPlusEvent) : null;
!details ? cart.addEventListener('click', updateCountMinusEvent) : null;
