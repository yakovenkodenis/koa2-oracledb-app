const Koa = require('koa');
const router = require('koa-router')();
const hbs = require('koahub-handlebars');
const oracledb = require('oracledb');

const renderView = require('./util/render-view');
const executePLSQL = require('./util/db');

router
    .get('home', '/', async (ctx, next) => {

        // executePLSQL("select 2+2 from dual", [], (err, result) => {
        //     if (err) {
        //         console.log(err.message);
        //     } else {
        //         console.log(result.rows);
        //     }
        // });

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
//     await ctx.render('home');
// });

app.listen(3000);
