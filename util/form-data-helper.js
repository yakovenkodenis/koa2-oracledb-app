module.exports = {
    buy_book_data: {
        action: "/api/v1/books/buy",
        fields: [
            {
                id: "buy_book_form_user_id",
                type: "number",
                placeholder: "User ID",
                name: "user_id"
            },
            {
                id: "buy_book_form_book_id",
                type: "number",
                placeholder: "Book ID",
                name: "book_id"
            },
            {
                id: "buy_book_form_books_count",
                type: "number",
                placeholder: "Number of books",
                name: "books_count"
            }
        ]
    },
    register_user_data: {
        action: "/api/v1/users/register",
        fields: [
            {
                id: "user_first_name",
                type: "text",
                placeholder: "User First Name",
                name: "first_name"
            },
            {
                id: "user_last_name",
                type: "text",
                placeholder: "User Last Name",
                name: "last_name"
            },
            {
                id: "user_email",
                type: "email",
                placeholder: "User Email",
                name: "email"
            },
            {
                id: "user_password",
                type: "password",
                placeholder: "User Password",
                name: "password"
            }
        ]
    },
    add_author_data: {
        action: "/api/v1/authors/new",
        fields: [
            {
                id: "author_first_name",
                type: "text",
                placeholder: "Author First Name",
                name: "first_name"
            },
            {
                id: "author_last_name",
                type: "text",
                placeholder: "Author Last Name",
                name: "last_name"
            },
            {
                id: "author_birthday",
                type: "data",
                placeholder: "Author Birthday",
                name: "birthday"
            }
        ]
    },
    add_publisher_data: {
        action: "/api/v1/publishers/new",
        fields: [
            {
                id: "publisher_name",
                type: "text",
                placeholder: "Publisher Name",
                name: "name"
            }
        ] 
    },
    cascade_remove_author_data: {
        action: "/api/v1/authors/delete",
        fields: [
            {
                id: "author_id",
                type: "number",
                placeholder: "Author ID",
                name: "id"
            }
        ] 
    },
    cascade_remove_publisher_data: {
        action: "/api/v1/publishers/delete",
        fields: [
            {
                id: "publisher_id",
                type: "number",
                placeholder: "Publisher ID",
                name: "id"
            }
        ] 
    },
    set_discount_for_publisher_data: {
        action: "/api/v1/publishers/set_discount",
        fields: [
            {
                id: "publisher_id",
                type: "number",
                placeholder: "Publisher ID",
                name: "id"
            },
            {
                id: "discount",
                type: "number",
                placeholder: "Discount",
                name: "discount"
            }
        ] 
    }
};
