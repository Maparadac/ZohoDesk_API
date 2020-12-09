var express = require('express'),
  router = express.Router(),
  createError = require('http-errors'),
  middlewares = require('../../shared/middlewares'),
  axiosSingleton = require('../../shared/axiosSingleton')(),
  debug = require('debug')('econtainers-zoho:records'),
  ZOHO_API_CRM_RESOURCE = process.env.ZOHO_API_CRM_RESOURCE;

router.param('module_api_name', function (request, response, next, module_api_name) {
  debug('param', 'module_api_name', module_api_name);

  if (!module_api_name
    || global.MODULES.SUPPORTED.includes(module_api_name))
    return next();

  next(createError(404));
})

/**
 * Get Records Using External ID
 * https://www.zoho.com/crm/developer/docs/api/v2/get-records-ext.html
 * 
 * Response
 * https://www.zoho.com/crm/developer/docs/api/v2/leads-response.html
 */
router.get('/:module_api_name',
  middlewares.accessTokenMiddleware,
  function (request, response, next) {
    debug('get');
    axiosSingleton.get(`${ZOHO_API_CRM_RESOURCE}/${request.params.module_api_name}`)
      .then(function (recordsResponse) {
        debug('get', recordsResponse.data);
        response.json(recordsResponse.data).end();
      })
      .catch(function (error) {
        debug('get', 'error', error);
        next(new Error(error));
      });
  });

/**
 * Get Records API
 * https://www.zoho.com/crm/developer/docs/api/v2/get-records.html
 * 
 * Response
 * https://www.zoho.com/crm/developer/docs/api/v2/leads-response.html
 */
router.get('/:module_api_name/search',
  middlewares.accessTokenMiddleware,
  function (request, response, next) {
    debug('get', 'search', 'request.query', request.query);

    var queryRequest = request.query,
      queryString = Object.keys(queryRequest).reduce(function (store, value) { return store += `${value}=${queryRequest[value]}` }, '')

    debug('get', 'search', 'queryString', queryString);

    axiosSingleton.get(`${ZOHO_API_CRM_RESOURCE}/${request.params.module_api_name}/search?${queryString}`)
      .then(function (recordsResponse) {
        debug('get', 'search', 'recordsResponse', recordsResponse.data);
        response.json(recordsResponse.data).end();
      })
      .catch(function (error) {
        debug('get', 'search', 'error', error);
        next(new Error(error));
      });
  })

/**
 * Get Records API
 * https://www.zoho.com/crm/developer/docs/api/v2/get-records.html
 * 
 * Response
 * https://www.zoho.com/crm/developer/docs/api/v2/leads-response.html
 */
router.get('/:module_api_name/:record_id',
  middlewares.accessTokenMiddleware,
  function (request, response, next) {
    debug('get', request.params.module_api_name, request.params.record_id);


    axiosSingleton.get(`${ZOHO_API_CRM_RESOURCE}/${request.params.module_api_name}/${request.params.record_id}`)
      .then(function (recordsResponse) {
        debug('get', 'record_id', recordsResponse.data);
        response.json(recordsResponse.data).end();
      })
      .catch(function (error) {
        debug('get', 'record_id', 'error', error);
        next(new Error(error));
      });
  });

/**
 * Insert Records API
 * https://www.zoho.com/crm/developer/docs/api/v2/insert-records.html
 * 
 * Response
 * https://www.zoho.com/crm/developer/docs/api/v2/leads-response.html
 */
router.post('/:module_api_name',
  middlewares.accessTokenMiddleware,
  function (request, response, next) {
    debug('post', 'request.body', request.body);
    var data = request.body;
    axiosSingleton.post(`${ZOHO_API_CRM_RESOURCE}/${request.params.module_api_name}`, data)
      .then(function (recordResponse) {
        debug('post', recordResponse.data);
        response.json(recordResponse.data).end();
      })
      .catch(function (error) {
        debug('post', 'error', error);
        next(new Error(error));
      });
  });

module.exports = router;
