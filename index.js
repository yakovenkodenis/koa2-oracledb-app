const Koa = require('koa');
const router = require('koa-router')();
const hbs = require('koahub-handlebars');
const oracledb = require('oracledb');

const renderView = require('./util/render-view');


router
    .get('home', '/', async (ctx, next) => {
        ctx.body = await renderView('./www/home.hbs');
        await next();
    })
    .get('test', '/test', async (ctx, next) => {
        console.log('/Test');
        await next();
    });

const app = new Koa();

app.use(hbs.middleware({
    extname: '.hbs',
    viewPath: './www',
    layoutsPath: './www',
    partialsPath: './www'
}));

app
    .use(router.routes())
    .use(router.allowedMethods());

// app.use(async (ctx, next) => {

//     // oracledb.getConnection(
//     //     {
//     //         user: "root",
//     //         password: "root",
//     //         connectString: "localhost/XE"
//     //     }
//     // ).then(connection => {
//     //     return connection.execute(
//     //         "select 2+2 from dual", []
//     //     ).then(result => {
//     //         console.log(result.metaData);
//     //         console.log(result.rows);

//     //         return connection.release();
//     //     }).catch(err => {
//     //         console.log(err.message);
//     //         return connection.release();
//     //     })
//     // }).catch(err => console.log(err.message));

//     await ctx.render('home');

// });

app.listen(3000);
