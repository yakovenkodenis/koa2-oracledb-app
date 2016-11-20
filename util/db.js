const oracledb = require('oracledb');


const executePLSQL = (statement, params=[], callback) => {
    oracledb.getConnection(
        {
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECTION_STRING
        }
    ).then(connection => {
        return connection.execute(
            statement, params
        ).then(result => {
            callback(null, result);
            return connection.release();
        }).catch(err => {
            callback(err, null);
            return connection.release();
        })
    }).catch(err => callback(err, null));
}

module.exports = executePLSQL;
