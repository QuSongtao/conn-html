const currency = function (value) {
  return value + 1;
};
const getFileType = function (fileName) {
  if (fileName) {
    let arr = fileName.split('.');
    return arr[1];
  }
  return '';
};

export default {
  currency,
  getFileType
};
