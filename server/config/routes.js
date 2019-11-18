/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` your home page.            *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/
  '/*': function(req, res, next) {sails.log.info(req.method, req.url); next();},

  'POST /api/jwt/auth': 'JwtController.auth',
  'POST /api/jwt/signup': 'JwtController.signup',
  'GET /api/jwt/me': 'JwtController.me',

  'GET /api/books/count': 'BookController.count',
  'GET /api/books/:id/download': 'BookController.download',

  'GET /api/users/count': 'UserController.count',

  'GET /api/orders/count': 'OrderController.count',


  // '/': { view: 'pages/homepage' }


  /***************************************************************************
   *                                                                          *
   * More custom routes here...                                               *
   * (See https://sailsjs.com/config/routes for examples.)                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the routes in this file, it   *
   * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
   * not match any of those, it is matched against static assets.             *
   *                                                                          *
   ***************************************************************************/


};
