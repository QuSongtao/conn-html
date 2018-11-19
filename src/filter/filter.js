/*
 * 公共过滤器: filter.js
 * 参考技术文档: https://cn.vuejs.org/v2/guide/filters.html
 * <!-- 在双花括号中 -->
 * {{ message | capitalize }}
 * <!-- 在 `v-bind` 中 -->
 * <div v-bind:id="rawId | formatId"></div>
 */

/**
 * 过滤器: 值递增1
 * @param value
 * @returns {*}
 */
const currency = function (value) {
  return value + 1;
};

/**
 * 过滤器: 获取文件类型(后缀)
 * @param fileName
 * @returns {*}
 */
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
