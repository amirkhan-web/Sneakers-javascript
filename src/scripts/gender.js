import { details, gender } from './selectors';

const genderArray = [
  { name: 'Мужские', gen: 'men' },
  { name: 'Женские', gen: 'women' },
];

const renderGender = () => {
  return genderArray
    .map(
      (g) =>
        `<button data-value=${g.gen} class='gender__item'>${g.name}</button>`
    )
    .join('');
};

!details ? gender.insertAdjacentHTML('beforeend', renderGender()) : null;

export const btnsGender = !details
  ? gender.querySelectorAll('.gender__item')
  : '';
