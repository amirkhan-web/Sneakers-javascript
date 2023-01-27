import { btnDropdown } from '../scripts/dropdown';
import { btnsGender } from '../scripts/gender';
import { details } from '../scripts/selectors';

export const methodsUrl = {
  items: 'http://localhost:3001/items?',
  cart: 'http://localhost:3001/cart',
  users: 'http://localhost:3001/users',
};

export const dataFilter = [
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
