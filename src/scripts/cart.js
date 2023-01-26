import { apiData } from '../api/api';
import { renderDocumentList } from '../utils/renderDocumentList';
import { cart, cartBtn, lists, details } from './selectors';

let cartData = [];

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
      apiData.updateCount(id, foundItems.count);
      updateCountDataPlus();
      renderCart(cartData);
    } else {
      cartData.push(newItem);

      apiData.addToCart(newItem);

      renderCart(cartData);
    }
  }
};

const removeCart = async ({ target }) => {
  if (target.matches('.cart__remove')) {
    const parentNode = target.closest('.cart__item');
    const id = parentNode.id;

    cartData = cartData.filter((item) => item.id !== id);

    apiData.removeCart(id);

    parentNode.remove();
  }
};

const updateCountPlusEvent = ({ target }) => {
  if (target.matches('.cart__plus')) {
    const parentNode = target.closest('.cart__item');
    const id = parentNode.id;

    let foundItems = cartData.find((item) => item.id === id);

    updateCountDataPlus();

    apiData.updateCountPlus(id, foundItems.count);

    renderCart(cartData);
  }
};

const updateCountMinusEvent = ({ target }) => {
  if (target.matches('.cart__minus')) {
    const parentNode = target.closest('.cart__item');
    const id = parentNode.id;

    let foundItems = cartData.find((item) => item.id === id);

    updateCountDataMinus();

    apiData.updateCountMinus(id, foundItems.count);

    renderCart(cartData);
  }
};

apiData.getCart(renderCart);

!details ? lists.addEventListener('click', addToCart) : null;
!details ? cart.addEventListener('click', removeCart) : null;
!details ? cart.addEventListener('click', updateCountPlusEvent) : null;
!details ? cart.addEventListener('click', updateCountMinusEvent) : null;
