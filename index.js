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

        // executePLSQL(...dataOps.addAuthor('Harper', 'Lee', '28/4/1926'));

        executePLSQL('select * from authors', [], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
            }
        });

        // const statement = dataOps.addBooksToStore(
        //     'To Kill a Mockingbird',
        //     1,
        //     "Shoot all the bluejays you want, if you can hit em, but remember it's a sin to kill a mockingbird.",
        //     1,
        //     'https://images-na.ssl-images-amazon.com/images/I/51A6rmAqknL._SX309_BO1,204,203,200_.jpg',
        //     10,
        //     6.99
        // );
        // executePLSQL(...statement, (err, result) => {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         console.log(result);
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
