function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Koa = require('koa');
const oracledb = require('oracledb');

const app = new Koa();

app.use((() => {
    var _ref = _asyncToGenerator(function* (ctx, next) {
        ctx.body = 'Hello World!';

        oracledb.getConnection({
            user: "root",
            password: "root",
            connectString: "localhost/XE"
        }, function (err, connection) {
            if (err) {
                console.log('oracledb.getConnetion(...): ', err.message);
                return;
            }

            connection.execute("SELECT 2+2 from dual;", [], function (err, result) {
                if (err) {
                    console.log('connection.execute(...): ', err.message);
                    return;
                }
                console.log(result.rows);
            });
        });
    });

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
})());

app.listen(3000);
