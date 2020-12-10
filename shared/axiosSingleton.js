let axios = require('axios'),
    axiosSingleton;

module.exports = function () {
    if (!axiosSingleton)
        axiosSingleton = axios.create();

    return axiosSingleton;
}