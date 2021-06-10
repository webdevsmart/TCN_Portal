/**
 * Return ellipsis of a given string
 * @param {string} text
 * @param {number} size
 */
const ellipsis = (text, size) => {
  return `${text
    .split(' ')
    .slice(0, size)
    .join(' ')}...`;
};

const numberWithCommas = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export { ellipsis, numberWithCommas };
