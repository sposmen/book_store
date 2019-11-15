// Required because is not already set in the global context
const JwtService = require('../services/JwtService');
module.exports = JwtService.createPolicy();
