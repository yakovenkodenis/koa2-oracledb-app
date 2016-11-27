/* @flow weak */

require('dotenv').config();

const Koa = require('koa');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const router = require('koa-router')();
const oracledb = require('oracledb');
const remoteBase64 = require('node-remote-base64');

const api = require('./api');
const renderView = require('./util/render-view');
const executePLSQL = require('./util/db');
const dataOps = require('./data-ops');
const formsData = require('./util/form-data-helper');


router
    .get('home', '/', async (ctx, next) => {
        ctx.body = await renderView('./www/views/index.hbs');
        await next();
    })
    .get('forms', '/forms', async (ctx, next) => {
        ctx.body = await renderView('./www/views/forms.hbs', formsData);
        await next();
    })
    .get('errors', '/errors/', async (ctx, next) => {
        ctx.body = await renderView('./www/views/errors.hbs');
        await next();  
    });

const app = new Koa();

app
    .use(bodyParser())
    .use(router.routes())
    .use(api.routes())
    .use(api.allowedMethods())
    .use(router.allowedMethods())
    .use(serve(__dirname + '/static'));

app.listen(3000);
