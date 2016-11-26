var editor; // use a global for the submit and return data rendering in the examples
 
$(document).ready(function() {
    editor = new $.fn.dataTable.Editor( {
        ajax: "api/v1/books",
        table: "#example",
        idSrc: "id",
        fields: [ {
                label: "Book Name:",
                name: "name"
            }, {
                label: "Book Description:",
                name: "description",
                type: "textarea"
            }, {
                label: "Price:",
                name: "price"
            }, {
                label: "Author First Name:",
                name: "author_first_name"
            }, {
                label: "Author Last Name:",
                name: "author_last_name",
            }, {
                label: "Publisher:",
                name: "publisher_name"
            }
        ]
    } );
 
    var table = $('#example').DataTable( {
        lengthChange: false,
        ajax: "api/v1/books",
        columns: [
            { data: 'id' },
            { data: 'name' },
            { data: 'price', render: function ( data, type, row ) {
                return '$' + data;
            } },
            { data: null, render: function ( data, type, row ) {
                return data.author_first_name + ' ' + data.author_last_name;
            } },
            { data: "publisher_name" },
        ],
        select: true
    } );
 
    // Display the buttons
    new $.fn.dataTable.Buttons( table, [
        { extend: "create", editor },
        { extend: "edit",   editor },
        { extend: "remove", editor }
    ] );
 
    table.buttons().container()
        .appendTo( $('.col-sm-6:eq(0)', table.table().container() ) );

} );
