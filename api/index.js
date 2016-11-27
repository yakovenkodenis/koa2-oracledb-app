const qs = require('querystring');
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
        const authors = await executePLSQL(...dataOps.getAllAuthors());
        const publishers = await executePLSQL(...dataOps.getAllPublishers());

        const data = {
            data: prepareData(books),
            authors: prepareData(authors),
            publishers: prepareData(publishers)
        };
        ctx.body = JSON.stringify(data);
    })
    .post('/books/new', async (ctx, next) => {
        const { request: { body: { data } } } = ctx;
        const row = data[0];

        const dbResponse = await executePLSQL(...dataOps.addBooksToStore(
            row.name, row.author_id, row.description,
            row.publisher_id, row.book_cover_img,
            row.available_count, row.price
        ));

        ctx.status = 201;
        ctx.body = JSON.stringify({ data });
    })
    .put('/books/edit', async (ctx, next) => {
        const { request: { body: { data } } } = ctx;
        const key = Object.keys(data)[0];
        const row = data[key];

        await executePLSQL(...dataOps.updateBook(
            key, row.name, row.price, row.author_id, row.publisher_id,
            row.available_count, row.cover_img
        ));

        ctx.status = 200;
        ctx.body = JSON.stringify({ data });
    })
    .delete('/books/delete', async (ctx, next) => {
        const { request: { url } } = ctx;
        const id = Object.values(qs.parse(url))[0];

        await executePLSQL(...dataOps.deleteBook(id));

        ctx.status = 200;
        ctx.body = { data: id }
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
    });

module.exports = api;
