/* @flow weak */

require('dotenv').config();

const Koa = require('koa');
const serve = require('koa-static');
const router = require('koa-router')();
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

        ctx.body = await renderView('./www/views/index.hbs');
        await next();
    })
    .get('test', '/test', async (ctx, next) => {
        console.log('/Test');
        await next();
    });

const app = new Koa();

app
    .use(router.routes())
    .use(router.allowedMethods())
    .use(serve(__dirname + '/static'));

app.listen(3000);
