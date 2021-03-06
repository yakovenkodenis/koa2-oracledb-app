/* @flow weak */
const oracledb = require('oracledb');
const { zipParams } = require('../util/zipParams');


const PACKAGE = 'books_store';


const getAllBooks = () => [
    `select * from books`,
    []
];

const getAllAuthors = () => [
    'select * from authors',
    []
];

const getAllPublishers = () => [
    'select * from publishers',
    []
];

const updateBook = (
    id, name, price, author_id, publisher_id,
    availabile_count, cover_img) => [
    'update books set name = :new_name, price = :new_price, '
        + 'author_id = :new_author_id, publisher_id = :new_pubisher_id, '
        + 'available_count = :new_available_count, cover_img = :new_cover_img '
        + 'where id = :id',
    [name, price, author_id, publisher_id, availabile_count, cover_img, id]
];

const deleteBook = (id) => [
    'delete from books where id = :id',
    [id]
];

const getAllBooksWithAuthorsAndPublishers = () => [
    'select books.*, '
        + 'authors.first_name as author_first_name, '
        + 'authors.last_name as author_last_name, '
        + 'authors.birthday as author_birthday, '
        + 'publishers.name as publisher_name ' 
        + 'from books, authors, publishers '
        + 'where books.author_id = authors.id and books.publisher_id = publishers.id',
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

const getErrorsRegistry = () => [
    'select * from errors_registry',
    []
];

const getSalesRegistry = () => [
    'select * from sales_registry',
    []
];

const getReadableSalesRegistry = () => [
    "select sales.id, sales.sale_date, users.first_name || ' ' || "
        + "users.last_name, books.name, books_count from users, "
        + "books, sales where users.id = sales.user_id and books.id = sales.book_id",
    []
];

const getAllUsers = () => [
    'select * from users',
    []
];


module.exports = {
    getBooksCSVbyPublisher, countAllBooksByAuthor,
    buyBook, addBooksToStore,
    registerUser,
    addAuthor, cascadeRemoveAuthor,
    addPublisher, cascadeRemovePublisher,
    createSale, setDiscountForPublisher,

    getAllBooks, getAllBooksWithAuthorsAndPublishers,
    getAllAuthors, getAllPublishers,
    updateBook, deleteBook,

    getErrorsRegistry, getSalesRegistry,
    getReadableSalesRegistry,
    getAllUsers
};
