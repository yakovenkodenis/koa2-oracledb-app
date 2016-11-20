const oracledb = require('oracledb');


const executePLSQL = (statement, params=[], callback) => {
    oracledb.getConnection(
        {
            user: "root",
            password: "root",
            connectString: "localhost/XE"
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
