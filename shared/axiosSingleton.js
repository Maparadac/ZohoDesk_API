let axios = require('axios'),
    axiosSingleton;

module.exports = () => {
    if (!axiosSingleton)
        axiosSingleton = axios.create();

    return axiosSingleton;
}