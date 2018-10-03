import axios from 'axios';
// import Utils from "../utils/util.class";
import {Loading, Message} from 'element-ui';

let baseURL = process.env.BASE_API;
console.log(process.env.BASE_API);
axios.defaults.headers['Content-Type'] = 'Content-Type: application/json';
export default class Http {
  static toType (obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
  }

  static filterNull (o) {
    for (let i in o) {
      if (o[i] === null || o[i] === undefined || o[i] === '') {
        delete o[i];
      }
      if (this.toType(o[i]) === 'string') {
        o[i] = o[i].trim();
      } else if (this.toType(o[i]) === 'object') {
        o[i] = this.filterNull(o[i]);
      } else if (this.toType(o[i]) === 'array') {
        o[i] = this.filterNull(o[i]);
      }
    }
    return o;
  }
  static openApiAxios (params) {
    params.data = this.filterNull(params.data);
    let _this = this;
    let _finally = '';
    let _beforeSuccess = '';
    let _success = '';
    let _error = '';
    if (params.finally && params.finally !== null) {
      _finally = params.finally;
    }
    if (params.success && params._uccess !== null) {
      _success = params.success;
    }
    if (params.beforeSuccess && params.beforeSuccess !== null) {
      _beforeSuccess = params.beforeSuccess;
    }
    if (params.error && params.error !== null) {
      _error = params.error;
    }
    this.LoadFlag++;
    let loadinginstace = Loading.service();
    axios({
      method: params.method || 'POST',
      url: params.url,
      data: params.data,
      baseURL: baseURL,
      withCredentials: false,
      timeout: 20000
    }).then((res) => {
      this.LoadFlag--;
      if (this.LoadFlag === 0) {
        loadinginstace.close();
      }
      if (typeof _beforeSuccess === 'function') {
        _beforeSuccess(res.data.data);
      }
      if (res.data.successful) {
        _success(res.data);
      } else {
        // PP0008 PP0009 都直接取登录
        if (res.data.bizCode.code === 'PP0008' || res.data.bizCode.code === 'PP0009') {
          Message.error({
            message: res.data.bizCode.info
          });
        } else {
          if (_error) {
            _error(res.data);
          } else {
            // 弹出错误消息
            Message.error({
              message: res.data.bizCode.info
            });
          }
        }
      }
      if (typeof _finally === 'function') {
        _finally();
      }
    }).catch(function (err) {
      _this.LoadFlag = 0;
      if (err) {
        let message = err.message;
        if (message.indexOf('Network') > -1) {
          Message.error({
            message: '网络错误'
          });
        }
        if (message.indexOf('timeout') > -1) {
          Message.error({
            message: '请求超时，系统异常'
          });
        }
        if (message.indexOf('404') > -1) {
          Message.error({
            message: 'url路径错误'
          });
        }
      }
      loadinginstace.close();
    });
  }
}
