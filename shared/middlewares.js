let middlewares = {},
    axiosSingleton = require('./axiosSingleton')(),
    debug = require('debug')('econtainers-zoho-api:records'),
    ZOHO_API_ACCOUNTS_OAUTH_TOKEN_RESOURCE = process.env.ZOHO_API_ACCOUNTS_OAUTH_TOKEN_RESOURCE;

middlewares.accessTokenMiddleware = function (request, response, next) {
    axiosSingleton.post(`${ZOHO_API_ACCOUNTS_OAUTH_TOKEN_RESOURCE}?refresh_token=${process.env.REFRESH_TOKEN}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=${process.env.GRANT_TYPE}`)
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