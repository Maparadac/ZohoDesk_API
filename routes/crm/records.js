let express = require('express'),
  router = express.Router(),
  createError = require('http-errors'),
  middlewares = require('../../shared/middlewares'),
  axiosSingleton = require('../../shared/axiosSingleton')(),
  debug = require('debug')('econtainers-zoho-api:records'),
  ZOHO_API_CRM_RESOURCE = process.env.ZOHO_API_CRM_RESOURCE;

const Fs = require('fs');
const Path = require('path');

router.param('module_api_name', (request, response, next, module_api_name) => {
  debug('param', 'module_api_name', module_api_name);

  if (module_api_name
    && global.MODULES.SUPPORTED.includes(module_api_name))
    return next();

  next(createError(404));
});

/**
 * Get Related Records Using External ID API
 * https://www.zoho.com/crm/developer/docs/api/v2/get-related-records.html
 * 
 * Response
 * https://www.zoho.com/crm/developer/docs/api/v2/leads-response.html
 */
router.get('/:module_api_name/:record_id/photo',
  middlewares.accessTokenMiddleware,
  async function (request, response, next) {
    const { module_api_name, record_id } = request.params;
    debug('get', '/:module_api_name/:record_id/photo', module_api_name, record_id);

    axiosSingleton.get(`${ZOHO_API_CRM_RESOURCE}/${module_api_name}/${record_id}/photo`, {
      responseType: 'arraybuffer'
    })
      .then(function (recordsResponse) {
        debug('get', '/:module_api_name/:record_id/photo', true);
        response.set('Content-Type', 'image/png');
        response.send(recordsResponse.data).end();
      })
      .catch(function (error) {
        debug('get', '/:module_api_name/:record_id/photo', 'error', error);
        next(new Error(error));
      });
  });

/**
 * Refactoring Search Records API
 * https://www.zoho.com/crm/developer/docs/api/v2/search-records.html
 * 
 * Response
 * https://www.zoho.com/crm/developer/docs/api/v2/search-records.html
 */
function search(module_api_name, queryString) {
  return axiosSingleton.get(`${ZOHO_API_CRM_RESOURCE}/${module_api_name}/search?${queryString}`);
}

/**
 * Search Records API
 * https://www.zoho.com/crm/developer/docs/api/v2/search-records.html
 * 
 * Response
 * https://www.zoho.com/crm/developer/docs/api/v2/search-records.html
 */
router.get('/:module_api_name/search',
  middlewares.accessTokenMiddleware,
  (request, response, next) => {
    const { module_api_name } = request.params;
    debug('get', '/:module_api_name/search', module_api_name, 'request.query', request.query);

    let queryRequest = request.query,
      queryString = Object.keys(queryRequest).reduce(function (store, value) { return store += `${value}=${queryRequest[value]}` }, '')

    debug('get', '/:module_api_name/search', module_api_name, 'queryString', queryString);

    search(request.params.module_api_name, queryString)
      .then(recordsResponse => {
        debug('get', '/:module_api_name/search', 'recordsResponse', recordsResponse.data);
        response.json(recordsResponse.data).end();
      })
      .catch(error => {
        debug('get', '/:module_api_name/search', 'error', error);
        next(new Error(error));
      });
  });

/**
 * Refactoring Related Records API
 * https://www.zoho.com/crm/developer/docs/api/v2/get-related-records.html
 * 
 * Response
 * https://www.zoho.com/crm/developer/docs/api/v2/get-related-records.html
 */
function related(module_api_name, record_id, related_record) {
  return axiosSingleton.get(`${ZOHO_API_CRM_RESOURCE}/${module_api_name}/${record_id}/${related_record}`);
}

/**
 * Get Related Records Using External ID API
 * https://www.zoho.com/crm/developer/docs/api/v2/get-related-records.html
 * 
 * Response
 * https://www.zoho.com/crm/developer/docs/api/v2/leads-response.html
 */
router.get('/:module_api_name/:record_id/:related_record',
  middlewares.accessTokenMiddleware,
  (request, response, next) => {
    const { module_api_name, record_id, related_record } = request.params;
    debug('get', '/:module_api_name/:record_id/:related_record', module_api_name, record_id, related_record);

    related(module_api_name, record_id, related_record)
      .then(recordsResponse => {
        debug('get', '/:module_api_name/:record_id/:related_record', recordsResponse.data);
        response.json(recordsResponse.data).end();
      })
      .catch(error => {
        debug('get', '/:module_api_name/:record_id/:related_record', 'error', error);
        next(new Error(error));
      });
  });

router.get('/:module_api_name/:record_id',
  middlewares.accessTokenMiddleware,
  function (request, response, next) {
    const { module_api_name, record_id } = request.params;
    debug('get', '/:module_api_name/:record_id', module_api_name, record_id);

    axiosSingleton.get(`${ZOHO_API_CRM_RESOURCE}/${module_api_name}/${record_id}`)
      .then(function (recordsResponse) {
        debug('get', '/:module_api_name/:record_id', recordsResponse.data);
        response.json(recordsResponse.data).end();
      })
      .catch(function (error) {
        debug('get', '/:module_api_name/:record_id', 'error', error);
        next(new Error(error));
      });
  });

/**
 * Get Records Using External ID
 * https://www.zoho.com/crm/developer/docs/api/v2/get-records-ext.html
 * 
 * Response
 * https://www.zoho.com/crm/developer/docs/api/v2/leads-response.html
 */
router.get('/:module_api_name',
  middlewares.accessTokenMiddleware,
  (request, response, next) => {
    const { module_api_name } = request.params;
    debug('get', '/:module_api_name', module_api_name);

    axiosSingleton.get(`${ZOHO_API_CRM_RESOURCE}/${module_api_name}`)
      .then(recordsResponse => {
        debug('get', '/:module_api_name', recordsResponse.data);
        response.json(recordsResponse.data).end();
      })
      .catch(error => {
        debug('get', '/:module_api_name', 'error', error);
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
  (request, response, next) => {
    let body = request.body;
    debug('post', '/:module_api_name', 'request.body', body);
    axiosSingleton.post(`${ZOHO_API_CRM_RESOURCE}/${request.params.module_api_name}`, body)
      .then(recordResponse => {
        debug('post', '/:module_api_name', 'recordResponse', recordResponse.data);
        response.json(recordResponse.data).end();
      })
      .catch(error => {
        debug('post', '/:module_api_name', 'error', error);
        next(new Error(error));
      });
  });

module.exports = router;