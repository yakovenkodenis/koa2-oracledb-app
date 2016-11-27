var editor; // use a global for the submit and return data rendering in the examples
var table;
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
                label: "Author:",
                name: "author_id",
                type: "select",
                options: [
                    { label: 'Loading...', value: undefined }    
                ]
            }, {
                label: "Publisher:",
                name: "publisher_id",
                type: "select",
                options: [
                    { label: 'Loading...', value: undefined }    
                ]
            }, {
                label: "Price:",
                name: "price"
            }
        ]
    } );

    table = $('#example').DataTable( {
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
        select: true,
        initComplete: (settings, json) => {
            editor.field('author_id').update(getAllAuthorsAsOptions(json));
            editor.field('publisher_id').update(getAllPublishersAsOptions(json));
        }
    } );
 
    // Display the buttons
    new $.fn.dataTable.Buttons( table, [
        { extend: "create", editor },
        { extend: "edit",   editor },
        { extend: "remove", editor }
    ] );
 
    table.buttons().container()
        .appendTo( $('.col-sm-6:eq(0)', table.table().container() ) );


    function getAllAuthorsAsOptions({ authors }) {
        return authors.map(({ id, first_name, last_name }) => ({
            label: `${first_name} ${last_name}`,
            value: id
        }));
    }

    function getAllPublishersAsOptions({ publishers }) {
        return publishers.map(({ id, name }) => ({
            label: name, value: id
        }));
    }
} );
