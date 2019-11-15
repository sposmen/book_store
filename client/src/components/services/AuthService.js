import JwtRequest from './JwtRequest';

let userData = null;
let authHooks = [];

function authResponse(resData, jwres) {
  if (jwres.statusCode === 200 && resData.user) {
    userData = resData.user;
  }
  authHooks.forEach(hook => hook(userData));
}

export const me = function me(cb = null) {
  if (userData) {
    if (authHooks.indexOf(cb) < 0) {
      authHooks.push(cb);
    }
    if(cb){
      return cb(userData);
    }
  }

  if (!authHooks.length) {
    if (!userData && JwtRequest.jwt) {
      JwtRequest.get({url: '/api/jwt/me'}, (resData, jwres) => {
        authResponse(resData, jwres);
      });
    }
  }
  if(cb){
    authHooks.push(cb);
  }
};

setInterval(me, 10000);

export const logout = function logout(cb) {
  userData = null;
  JwtRequest.flush();
  authHooks.forEach(hook => hook(userData));
};

export const signUp = (data, cb) => {
  // eslint-disable-next-line no-undef
  JwtRequest.post({
    url: '/api/jwt/signup',
    data: data
  }, (resData, jwres) => {
    authResponse(resData, jwres);
    cb(resData, jwres);
  });
};

export const signIn = (data, cb) => {
  // eslint-disable-next-line no-undef
  JwtRequest.post({
    url: '/api/jwt/auth',
    data: data
  }, (resData, jwres) => {
    authResponse(resData, jwres);
    cb(resData, jwres);
  });
};
