const api = require('koa-router')({
    prefix: '/api/v1'
});

const executePLSQL = require('../util/db');
const dataOps = require('../data-ops');
const zipColumnNames = require('../util/zipColumnNames');


const prepareData = dbResponse => {
    return dbResponse.rows.map(row => zipColumnNames(dbResponse.metaData, row));
}

api
    .get('/books', async (ctx, next) => {
        const books = await executePLSQL(...dataOps.getAllBooksWithAuthorsAndPublishers());
        const data = {
            data: prepareData(books)
        };
        ctx.body = JSON.stringify(data);
    })
    .post('/books', async (ctx, next) => {
        console.log('POOOST');
        console.log(ctx.params);
    })
    .get('/authors', async (ctx, next) => {
        const authors = await executePLSQL(...dataOps.getAllAuthors());
        const data = {
            data: prepareData(authors)
        };
        ctx.body = JSON.stringify(data);
    })
    .get('/publishers', async (ctx, next) => {
        const publishers = await executePLSQL(...dataOps.getAllPublishers());
        const data = {
            data: prepareData(publishers)
        };
        ctx.body = JSON.stringify(data);
    })

module.exports = api;
