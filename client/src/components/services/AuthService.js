export const signUp = (data, cb) => {
  // eslint-disable-next-line no-undef
  return io.socket.request({
    method: 'POST',
    url: '/api/jwt/signup',
    data: data
  }, cb);
};

export const signIn = (data, cb) => {
  // eslint-disable-next-line no-undef
  io.socket.request({
    method: 'POST',
    url: '/api/jwt',
    data: data
  }, cb);
};
