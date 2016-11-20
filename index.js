const Koa = require('koa');
const oracledb = require('oracledb');


const app = new Koa();

app.use(async (ctx, next) => {
    ctx.body = 'Hello World!';

    oracledb.getConnection(
        {
            user: "root",
            password: "root",
            connectString: "localhost/XE"
        }
    ).then(connection => {
        return connection.execute(
            "select 2+2 from dual", []
        ).then(result => {
            console.log(result.metaData);
            console.log(result.rows);

            return connection.release();
        }).catch(err => {
            console.log(err.message);
            return connection.release();
        })
    }).catch(err => console.log(err.message));

});

app.listen(3000);
