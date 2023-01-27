import { login } from '../api/api-login';
import { renderDocumentList } from '../utils/renderDocumentList';
import { details, loginWrapper, modal, signup } from './selectors';

const logout = () => {
  localStorage.removeItem('user');
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

      !details ? logoutBtn.addEventListener('click', logout) : null;
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

function getUser() {
  return JSON.parse(localStorage.getItem('user') || null);
}

if (!details) {
  const { open, outside } = renderModal();
  signup.addEventListener('click', open);
  document.addEventListener('click', outside);
}
