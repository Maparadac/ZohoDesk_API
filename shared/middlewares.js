var middlewares = {},
    createError = require('http-errors'),
    axios = require('axios');

middlewares.supportedModule = function (request, response, next) {
    console.log('supportedModule', request.params, global.modules.supported);
    if (request.params.module_api_name
        && global.modules.supported.includes(request.params.module_api_name))
        return next();

    next(createError(404));
}

middlewares.accessTokenMiddleware = function (request, response, next) {
    axios.post(`https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=${process.env.GRANT_TYPE}`)
        .then(function (responseAccessToken) {
            request.zoho = { accessToken: responseAccessToken.data };
            return next();
        })
        .catch(function (error) {
            return next(new Error(error));
        });
}

module.exports = middlewares;