import { getDataPage } from '../api/api-items';
import { renderDocumentList } from '../utils/renderDocumentList';
import { details } from './selectors';

let hash = location.hash.substring(1);

const renderDetailsPage = (data) => {
  if (details) {
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

    return details;
  }
};

window.addEventListener('hashchange', () => {
  hash = location.hash.substring(1);
});

getDataPage(renderDetailsPage, hash);
