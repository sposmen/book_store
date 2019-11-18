import JwtRequest from './JwtRequest';

let userData = null;
let authHooks = [];

function authResponse(resData, jwres) {
  if (jwres.statusCode === 200 && resData.user) {
    userData = resData.user;
  }
  authHooks.forEach(hook => hook(userData));
}

let gettingMe = false;

export const me = function me(cb = null) {
  // Check if cb is not null and is not already in the hooks
  if (cb && authHooks.indexOf(cb) < 0) {
    authHooks.push(cb);
  }
  // If userData is already set, probably just a single call
  if (userData && cb) {
    return cb(userData);
  }

  // There is no request in course and the user data is not populated but the user is signed in.
  if (!gettingMe && !userData && JwtRequest.jwt) {
    gettingMe = true;
    JwtRequest.get({url: '/api/jwt/me'}, (resData, jwres) => {
      gettingMe = false;
      authResponse(resData, jwres);
    });
  }
};

// This method is to clean unmounted components
export const unMe = function unMe(cb) {
  authHooks.splice(authHooks.indexOf(cb), 1);
};

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
