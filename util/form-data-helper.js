module.exports = {
    buy_book_data: {
        action: "/books/buy",
        fields: [
            {
                id: "buy_book_form_user_id",
                type: "number",
                placeholder: "User ID"
            },
            {
                id: "buy_book_form_book_id",
                type: "number",
                placeholder: "Book ID"
            },
            {
                id: "buy_book_form_books_count",
                type: "number",
                placeholder: "Number of books"
            }
        ]
    },
    register_user_data: {
        action: "/users/register",
        fields: [
            {
                id: "user_first_name",
                type: "text",
                placeholder: "User First Name"
            },
            {
                id: "user_last_name",
                type: "text",
                placeholder: "User Last Name"
            },
            {
                id: "user_email",
                type: "email",
                placeholder: "User Email"
            },
            {
                id: "user_password",
                type: "password",
                placeholder: "User Password"
            }
        ]
    },
    add_author_data: {
        action: "/authors/new",
        fields: [
            {
                id: "author_first_name",
                type: "text",
                placeholder: "Author First Name"
            },
            {
                id: "author_last_name",
                type: "text",
                placeholder: "Author Last Name"
            },
            {
                id: "author_birthday",
                type: "data",
                placeholder: "Author Birthday"
            }
        ]
    },
    add_publisher_data: {
        action: "/publishers/new",
        fields: [
            {
                id: "publisher_name",
                type: "text",
                placeholder: "Publisher Name"
            }
        ] 
    },
    cascade_remove_author_data: {
        action: "/authors/delete",
        fields: [
            {
                id: "author_id",
                type: "number",
                placeholder: "Author ID"
            }
        ] 
    },
    cascade_remove_publisher_data: {
        action: "/publishers/delete",
        fields: [
            {
                id: "publisher_id",
                type: "number",
                placeholder: "Publisher ID"
            }
        ] 
    }
};
