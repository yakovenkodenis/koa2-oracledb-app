/* @flow weak */
const oracledb = require('oracledb');
const { zipParams } = require('../util/zipParams');


const PACKAGE = 'books_store';


const getAllBooks = () => [
    `select * from books`,
    []
];

const getBooksCSVbyPublisher = (id) => [
    `begin :result := ${PACKAGE}.get_books_csv_by_publisher(:0); end;`,
    zipParams([id], oracledb.STRING)
];

const countAllBooksByAuthor = (id) => [
    `begin :result := ${PACKAGE}.count_all_books_by_author(:0); end;`,
    zipParams([id], oracledb.NUMBER)
];

const buyBook = (userId, bookId, booksCount) => [
    `begin ${PACKAGE}.buy_book(:user_id, :book_id, :books_count); end;`,
    [userId, bookId, booksCount]
];

const addBooksToStore = (
    bookName, bookAuthorId, bookDescription,
    bookPublisherId, bookCoverImg, booksCount,
    bookPrice) => [
    `begin ${PACKAGE}.add_books_to_store(
        :book_name, :book_author_id, :book_description, :book_publisher_id,
        :book_cover_img, :books_count, :book_price
    ); end;`,
    [
        bookName, bookAuthorId, bookDescription, bookPublisherId,
        bookCoverImg, booksCount, bookPrice
    ]
];

const registerUser = (userFirstName, userLastName, userEmail, userPassword) => [
    `begin ${PACKAGE}.register_user(
        :user_first_name, :user_last_name,
        :user_email, :user_password
    ); end;`,
    [userFirstName, userLastName, userEmail, userPassword]
];

const addAuthor = (authorFirstName, authorLastName, authorBirthday) => [
    `begin ${PACKAGE}.add_author(
        :author_first_name, :author_last_name, to_date(:author_birthday, 'dd/mm/yyyy')
    ); end;`,
    [authorFirstName, authorLastName, authorBirthday]
];

const cascadeRemoveAuthor = (authorId) => [
    `begin ${PACKAGE}.cascade_remove_author(:author_id); end;`,
    [authorId]
];

const addPublisher = (publisherName) => [
    `begin ${PACKAGE}.add_publisher(:publisher_name); end;`,
    [publisherName]
];

const cascadeRemovePublisher = (publisherId) => [
    `begin ${PACKAGE}.cascade_remove_publisher(:publisher_id); end;`,
    [publisherId]
];

const createSale = (
    sale_user_id, sale_book_id,
    sale_books_count, date_of_sale) => [
    `begin ${PACKAGE}.create_sale(
        :sale_user_id, :sale_book_id, :sale_books_count, :date_of_sale
    ); end;`,
    [sale_user_id, sale_book_id, sale_books_count, date_of_sale]
];

const setDiscountForPublisher = (publisherId, discount) => [
    `begin ${PACKAGE}.set_discount_for_publisher(:publisher_id, :discount); end;`,
    [publisherId, discount]
];


module.exports = {
    getBooksCSVbyPublisher, countAllBooksByAuthor,
    buyBook, addBooksToStore,
    registerUser,
    addAuthor, cascadeRemoveAuthor,
    addPublisher, cascadeRemovePublisher,
    createSale, setDiscountForPublisher,

    getAllBooks
};
