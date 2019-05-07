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
const dialogDrag = {
  bind (el, binding, vnode, oldVnode) {
    const dialogHeaderEl = el.querySelector('.el-dialog__header');
    const dragDom = el.querySelector('.el-dialog');
    dialogHeaderEl.style.cursor = 'move';

    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);

    dialogHeaderEl.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft;
      const disY = e.clientY - dialogHeaderEl.offsetTop;

      // 获取到的值带px 正则匹配替换
      let styL, styT;

      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (sty.left.includes('%')) {
        styL = +document.body.clientWidth * (+sty.left.replace(/%/g, '') / 100);
        styT = +document.body.clientHeight * (+sty.top.replace(/%/g, '') / 100);
      } else {
        styL = +sty.left.replace(/px/g, '');
        styT = +sty.top.replace(/px/g, '');
      }

      document.onmousemove = function (e) {
        // 通过事件委托，计算移动的距离
        const l = e.clientX - disX;
        const t = e.clientY - disY;
        // 移动当前元素
        dragDom.style.left = `${l + styL}px`;
        dragDom.style.top = `${t + styT}px`;

        // 将此时的位置传出去
        // binding.value({x:e.pageX,y:e.pageY})
      };

      document.onmouseup = function (e) {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }
};
export default {
  userPower,
  css,
  inputFocus,
  dialogDrag
};
