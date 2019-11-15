import _ from 'lodash';

class JwtRequest {
  static get(opts, cb) {
    JwtRequest.request(_.merge({}, opts, {method: 'GET'}), cb);
  }

  static post(opts, cb) {
    JwtRequest.request(_.merge({}, opts, {method: 'POST'}), cb);
  }

  static request(opts, cb) {
    // eslint-disable-next-line no-undef
    io.socket.request(_.merge({}, opts, {
      headers: {authorization: `Bearer ${JwtRequest.jwt}`}
    }), (resData, jwres) => {
      if (jwres.statusCode === 200 && resData.token) {
        localStorage.setItem('jwt', JwtRequest.jwt = resData.token);
      }
      cb(resData, jwres);
    });
  }

  static flush() {
    JwtRequest.jwt = undefined;
    localStorage.removeItem('jwt');
  }
}

JwtRequest.jwt = localStorage.getItem('jwt');

export default JwtRequest;
