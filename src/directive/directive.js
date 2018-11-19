/*
 * 自定义指令,可将指令用到DOM标签中
 * directive.js
 * 技术资料参考: https://cn.vuejs.org/v2/guide/custom-directive.html
 * 钩子函数说明:
 * 1. bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置
 * 2. inserted：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)
 * 3. update：所在组件的 VNode 更新时调用
 * 4. componentUpdated：指令所在组件的 VNode 及其子 VNode 全部更新后调用
 * 5. unbind：只调用一次，指令与元素解绑时调用
 */

/**
 * 用户权限自定义指令,根据绑定值动态隐藏元素
 * @type {{bind: userPower.bind}}
 */
const userPower = {
  bind: function (el, binding) {
    console.log(binding);
    if (binding.value === 10001) {
      el.style.display = 'none';
    }
  }
};

/**
 * 输入框获得和失去焦点的底边样式设置
 * @type {{bind: inputFocus.bind}}
 */
const inputFocus = {
  bind: function (el, binding) {
    el.onfocus = function () {
      el.style.borderBottom = '1px solid red';
    };
    el.onblur = function () {
      el.style.borderBottom = '1px solid #e9f1f6';
    };
  }
};

/**
 * 元素绑定css对象,如下:
 * {
 *     width: 120px,
 *     height: 50px
 * }
 * @type {{inserted(*, *): void, bind(*, *)}}
 */
const css = {
  // 钩子函数 ,el就是当前元素存在即调用
  inserted (el, binding) {
    let styleobj = binding.value;
    let arr = [];
    for (let key in styleobj) {
      arr.push(key + ':' + styleobj[key]);
    }
    arr = arr.join(';');
    el.style.cssText = arr;
  },
  bind (el, binding) {
    // 指令绑定在元素上时候执行，只执行一次
  }
};

export default {
  userPower,
  css,
  inputFocus
};
