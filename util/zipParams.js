const oracledb = require('oracledb');
const zipObject = require('lodash/zipObject');


const zipParams = (params, type) => {
    Object.assign({}, zipObject([...Array(params.length).keys()], params))
    return Object.assign({}, zipObject([...Array(params.length).keys()], params), {
        result: { dir: oracledb.BIND_OUT, type, maxSize: 2000 }
    });
};

module.exports = {
    zipParams
};
