const {
    default: axios
} = require('axios');


let express = require('express'),
    router = express.Router(),
    createError = require('http-errors'),
    middlewares = require('../../shared/middlewares'),
    axiosSingleton = require('../../shared/axiosSingleton')(),
    debug = require('debug')('desk-zoho-api:records'),
    ZOHO_API_DESK_RESOURCE = process.env.ZOHO_API_DESK_RESOURCE;

router.param('module_api_name', (request, response, next, module_api_name) => {
    debug('param', 'module_api_name', module_api_name);

    if (module_api_name &&
        global.MODULES.SUPPORTED.includes(module_api_name))
        return next();

    next(createError(404));
});

/**
 * Get A Response from module Desk
 */
router.get("/:module_api_name", middlewares.deskAccessTokenMiddleware, (request, response, next) => {
    response.json({
        "module": request.params.module_api_name
    }).end()
})

/**
 * Create a Ticket into Zoho Desk to provide info to Service Desk
 * https://desk.zoho.com/DeskAPIDocument#Tickets#Tickets_Createaticket
 * 
 * Response
 * https://desk.zoho.com/DeskAPIDocument#Tickets#Tickets_Createaticket
 */

router.post('/:module_api_name',
    middlewares.deskAccessTokenMiddleware,
    (request, response, next) => {
        let body = request.body;
        debug('post', '/:module_api_name', 'request.body', body);
        axiosSingleton.post(`${ZOHO_API_DESK_RESOURCE}/${request.params.module_api_name}`, body)
            .then(recordResponse => {
                debug('post', '/:module_api_name', 'recordResponse', recordResponse.data);
                response.json(recordResponse.data).end();
            })
            .catch(error => {
                debug('post', '/:module_api_name', 'error', error);
                next(new Error(error));
            });
    });


module.exports = router