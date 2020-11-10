var express = require('express'),
  router = express.Router(),
  createError = require('http-errors'),
  middlewares = require('../shared/middlewares'),
  axios = require('axios'),
  debug = require('debug')('econtainers-zoho:records');

var data = {
  "data": [
    {
      "Company": "Zylker",
      "Last_Name": "PRUEBA ALEJANDRO",
      "First_Name": "PRUEBA VALLEJO",
      "Email": "wolpretrex@gmail.com",
      "fromCountry": "Colombia",
      "Country": "Colombia",
      "State": "Texas",
      "Product_Name": "CONTENEDOR 10 PIES",
      "Product_SKU": "ART0123",
      "Lead_Status": "No contactado",
      "Lead_Source": "Formulario Contenedor",
      "Producto": "Condiciones Originales",
      "Cantidad": 1,
      "Score": 20,
      "Tipo_Cliente": "Natural",
      "Linea_de_negocio": "Compra",
      "Mobile": "3142193965",
      "Phone": "3335057"
    }
  ],
  "trigger": [
    "workflow"
  ]
};

router.param('module_api_name', function (request, response, next, module_api_name) {
  debug('param', 'module_api_name', module_api_name);

  if (!module_api_name
    || global.modules.supported.includes(module_api_name))
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
    axios.defaults.headers.common['Authorization'] = `Zoho-oauthtoken ${request.zoho.accessToken.access_token}`;
    axios.get(`https://www.zohoapis.com/crm/v2/${request.params.module_api_name}`)
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
    axios.defaults.headers.common['Authorization'] = `Zoho-oauthtoken ${request.zoho.accessToken.access_token}`;

    debug('get', 'search', 'request.query', request.query);

    var queryRequest = request.query,
      queryString = Object.keys(queryRequest).reduce(function (store, value) { return store += `${value}=${queryRequest[value]}` }, '')

    debug('get', 'search', 'queryString', queryString);

    axios.get(`https://www.zohoapis.com/crm/v2/${request.params.module_api_name}/search?${queryString}`)
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
    axios.defaults.headers.common['Authorization'] = `Zoho-oauthtoken ${request.zoho.accessToken.access_token}`;
    axios.get(`https://www.zohoapis.com/crm/v2/${request.params.module_api_name}/${request.params.record_id}`)
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
    axios.defaults.headers.common['Authorization'] = `Zoho-oauthtoken ${request.zoho.accessToken.access_token}`;
    axios.post(`https://www.zohoapis.com/crm/v2/${request.params.module_api_name}`, data)
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
