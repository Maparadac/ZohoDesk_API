var express = require('express'),
  router = express.Router(),
  middlewares = require('../shared/middlewares');

/**
 * Get Records Using External ID
 * https://www.zoho.com/crm/developer/docs/api/v2/get-records-ext.html
 */
router.get('/:module_api_name',
  middlewares.supportedModule,
  middlewares.accessTokenMiddleware,
  function (request, response, next) {
    //axios.defaults.headers.common['Authorization'] = `Zoho-oauthtoken ${accessToken.access_token}`;
    console.log(request.zoho, request.params);

    response.send('Module api name ' + request.params.module_api_name).end();
  });

module.exports = router;
