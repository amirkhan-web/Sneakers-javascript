import { details, dropdown } from './selectors';

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

export const btnDropdown = !details
  ? dropdown.querySelectorAll('.dropdown__list-item')
  : '';
