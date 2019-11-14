module.exports.jsonWebToken = {
  tokenSecret: 'i-am-a-secret-token',
  options:{expiresIn: '2h'}, //see below this section for more on `options`
  defaultAccountStatus: true,
  authType: 'email' //could be {email or username}
};
