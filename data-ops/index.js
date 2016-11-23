
const PACKAGE = 'books_store';

const getBooksCSVbyPublisher = (id) => [
    `select ${PACKAGE}.get_books_csv_by_publisher(:id) from dual`,
    [id]
];

const countAllBooksByAuthor = (id) => [
    `select ${PACKAGE}.count_all_books_by_author(:id) from dual`,
    [id]
];

const buyBook = (userId, bookId, booksCount) => [
    `exec ${PACKAGE}.buy_book(:user_id, :book_id, :books_count)`,
    [userId, bookId, booksCount]
];

const addBooksToStore = (
    bookName, bookAuthorId, bookDescription,
    bookPublisherId, bookCoverImg, booksCount,
    bookPrice) => [
    `exec ${PACKAGE}.add_books_to_store(
        :book_name, :book_author_id, :book_description, :book_publisher_id,
        :book_cover_img, :books_count, :book_price
    )`,
    [
        bookName, bookAuthorId, bookDescription, bookPublisherId,
        bookCoverImg, booksCount, bookPrice
    ]
];

const registerUser = (userFirstName, userLastName, userEmail, userPassword) => [
    `exec ${PACKAGE}.register_user(
        :user_first_name, :user_last_name,
        :user_email, :user_password
    )`,
    [userFirstName, userLastName, userEmail, userPassword]
];

const addAuthor = (authorFirstName, authorLastName, authorBirthday) => [
    `exec ${PACKAGE}.add_author(
        :author_first_name, :author_last_name, :author_birthday
    )`,
    [authorFirstName, authorLastName, authorBirthday]
];

const cascadeRemoveAuthor = (authorId) => [
    `exec ${PACKAGE}.cascade_remove_author(:author_id)`,
    [authorId]
];

const addPublisher = (publisherName) => [
    `exec ${PACKAGE}.add_publisher(:publisher_name)`,
    [publisherName]
];

const cascadeRemovePublisher = (publisherId) => [
    `exec ${PACKAGE}.cascade_remove_publisher(:publisher_id)`,
    [publisherId]
];

const createSale = (
    sale_user_id, sale_book_id,
    sale_books_count, date_of_sale) => [
    `exec ${PACKAGE}.create_sale(
        :sale_user_id, :sale_book_id, :sale_books_count, :date_of_sale
    )`,
    [sale_user_id, sale_book_id, sale_books_count, date_of_sale]
];

const setDiscountForPublisher = (publisherId, discount) => [
    `exec ${PACKAGE}.set_discount_for_publisher(:publisher_id, :discount)`,
    [publisherId, discount]
];


module.exports = {
    getBooksCSVbyPublisher, countAllBooksByAuthor,
    buyBook, addBooksToStore,
    registerUser,
    addAuthor, cascadeRemoveAuthor,
    addPublisher, cascadeRemovePublisher,
    createSale, setDiscountForPublisher
};
