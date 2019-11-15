/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
   *                                                                          *
   * Default policy for all controllers and actions, unless overridden.       *
   * (`true` allows public access)                                            *
   *                                                                          *
   ***************************************************************************/

  '*': 'UserIsUserPolicy', //Secure all routes with UserIsUserPolicy
  'JwtController': {
    'me': 'JwtPolicy',
    '*': true
  },

  'BookController': {
    '*': 'UserIsAdminPolicy' //secure this route with UserIsAdminPolicy
  },
  // 'ProfileController': {
  //   'destroy': 'UserIsAdminPolicy' //only admin can delete a profile, secured with UserIsAdminPolicy
  // }

};
