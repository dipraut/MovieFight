const debounce = (callback, delay = 1000) => {
  let timeId;
  return (...args) => {
    if (timeId) {
      clearTimeout(timeId);
    }
    timeId = setTimeout(() => {
      callback.apply(null, args);
    }, delay);
  };
};
