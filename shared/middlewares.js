let middlewares = {},
    axiosSingleton = require('./axiosSingleton')(),
    debug = require('debug')('econtainers-zoho-api:records'),
    ZOHO_API_ACCOUNTS_OAUTH_TOKEN_RESOURCE = process.env.ZOHO_API_ACCOUNTS_OAUTH_TOKEN_RESOURCE;

middlewares.accessTokenMiddleware = (request, response, next) => {
    axiosSingleton.post(`${ZOHO_API_ACCOUNTS_OAUTH_TOKEN_RESOURCE}?refresh_token=${process.env.REFRESH_TOKEN}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=${process.env.GRANT_TYPE}`)
        .then(responseAccessToken => {
            debug('accessTokenMiddleware', 'responseAccessToken', responseAccessToken.data);
            axiosSingleton.defaults.headers.common['Authorization'] = `Zoho-oauthtoken ${responseAccessToken.data.access_token}`;
            next();
        })
        .catch(error => {
            debug('accessTokenMiddleware', 'error', error);
            next(new Error(error));
        });
}


middlewares.deskAccessTokenMiddleware = (request, response, next) => {
    axiosSingleton.post(`${ZOHO_API_ACCOUNTS_OAUTH_TOKEN_RESOURCE}?refresh_token=${process.env.DESK_REFRESH_TOKEN}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=${process.env.GRANT_TYPE}`)
        .then(responseAccessToken => {
            debug('accessTokenMiddleware', 'responseAccessToken', responseAccessToken.data.access_token);
            axiosSingleton.defaults.headers.common['Authorization'] = `Zoho-oauthtoken ${responseAccessToken.data.access_token}`;
            axiosSingleton.defaults.headers.common['orgId'] = 702112150;
            next();
        })
        .catch(error => {
            debug('accessTokenMiddleware', 'error', error);
            next(new Error(error));
        });
}


module.exports = middlewares;