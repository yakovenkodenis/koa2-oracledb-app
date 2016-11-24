/* @flow weak */

require('dotenv').config();

const Koa = require('koa');
const serve = require('koa-static');
const router = require('koa-router')();
const oracledb = require('oracledb');
const remoteBase64 = require('node-remote-base64');

const renderView = require('./util/render-view');
const executePLSQL = require('./util/db');
const dataOps = require('./data-ops');


router
    .get('home', '/', async (ctx, next) => {

        // const data = await executePLSQL('select * from books', []);


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
