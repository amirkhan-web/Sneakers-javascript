import { apiData } from '../api/api';
import { renderDocumentList } from '../utils/renderDocumentList';
import { cart, cartBtn } from './selectors';

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

apiData.getCart(renderCart);
