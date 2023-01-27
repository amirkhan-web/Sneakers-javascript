import { renderCard } from './items';
import { details, searchForm } from './selectors';

const contains = async (callback, value) => {
  return await apiData.getItems(callback, value).then((data) => {
    if (value) {
      callback(
        data.filter((item) =>
          item.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      return data;
    }
  });
};

const server = {
  search({ target }) {
    const { value } = target;
    return new Promise((res) => {
      setTimeout(
        () =>
          res({
            list: contains(renderCard, value),
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
