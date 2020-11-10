var middlewares = {},
    axiosSingleton = require('./axiosSingleton')(),
    debug = require('debug')('econtainers-zoho:records');

middlewares.accessTokenMiddleware = function (request, response, next) {
    axiosSingleton.post(`https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=${process.env.GRANT_TYPE}`)
        .then(function (responseAccessToken) {
            debug('accessTokenMiddleware', 'responseAccessToken', responseAccessToken.data);
            axiosSingleton.defaults.headers.common['Authorization'] = `Zoho-oauthtoken ${responseAccessToken.data.access_token}`;
            next();
        })
        .catch(function (error) {
            debug('accessTokenMiddleware', 'error', error);
            next(new Error(error));
        });
}

module.exports = middlewares;