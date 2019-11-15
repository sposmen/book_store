import _ from 'lodash';
import axios from 'axios';
import JwtRequest from './JwtRequest';


class HardJwtRequest {
  static get(opts, cb) {
    return HardJwtRequest.request(_.merge({}, opts, {method: 'GET'}), cb);
  }

  static post(opts, cb) {
    return HardJwtRequest.request(_.merge({}, opts, {method: 'POST'}), cb);
  }

  static download(opts) {
    let filename;
    if(opts.filename){
      filename = opts.filename;
      delete opts.filename
    }
    return HardJwtRequest.request(_.merge({}, opts, {method: 'GET', responseType: 'blob'}))
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${filename || 'book'}.txt`);
      document.body.appendChild(link);
      link.click();
      setTimeout(() => document.body.removeChild(link), 1000);
    });
  }

  static request(opts, cb) {
    opts = _.merge(opts, {
      headers: {authorization: `Bearer ${JwtRequest.jwt}`}
    });

    // eslint-disable-next-line no-undef
    opts['url'] = `${io.sails.url}${opts['url']}`;
    return axios.request(opts, (resData, jwres) => {
      if (jwres.statusCode === 200 && resData.token) {
        localStorage.setItem('jwt', JwtRequest.jwt = resData.token);
      }
      cb(resData, jwres);
    });
  }

}

export default HardJwtRequest;
