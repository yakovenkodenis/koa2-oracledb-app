let $table = $('#table'),
    $remove = $('#remove'),
    selections = [];

const initTable = () => {
    $table.bootstrapTable({
        height: getHeight(),
        columns: [
            [
                {
                    field: 'state',
                    checkbox: true,
                    rowspan: 2,
                    align: 'center',
                    valign: 'middle'
                }, {
                    title: 'Book ID',
                    field: 'id',
                    rowspan: 2,
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    footerFormatter: totalTextFormatter
                }, {
                    title: 'Book Detail',
                    colspan: 3,
                    align: 'center'
                }
            ],
            [
                {
                    field: 'name',
                    title: 'Book Name',
                    sortable: true,
                    editable: true,
                    align: 'center',
                    footerFormatter: totalNameFormatter
                }, {
                    field: 'price',
                    title: 'Book Price',
                    sortable: true,
                    align: 'center',
                    editable: {
                        type: 'text',
                        title: 'Book Price',
                        validate(value) {
                            value = $.trim(value);
                            
                            if (!value) {
                                return 'This field is required';
                            }

                            if (!/^\$/.test(value)) {
                                return 'This field needs to start with $';
                            }

                            const data = $table.bootstrapTable('getData'),
                                  index = $(this).parents('tr').data('index');
                            console.log(data[index]);
                            return '';
                        }
                    },
                    footerFormatter: totalPriceFormatter
                }, {
                    field: 'operate',
                    title: 'Book Operate',
                    align: 'center',
                    events: operateEvents,
                    formatter: operateFormatter
                }
            ]
        ]
    });


    setTimeout(() => {
        $table.bootstrapTable('resetView');
    }, 200);

    $table.on('check.bs.table uncheck.bs.table ' +
        'check-all.bs.table uncheck-all.bs.table',
        () => {
            $remove.prop('disabled', !$table.bootstrapTable('getSelections').length);

            selections = getIdSelections();
    });

    $table.on('expand-row.bs.table', (e, index, row, $detail) => {
        if (index % 2 == 1) {
            $detail.html('Loading from ajax request...');
            $.get('LICENSE', res => {
                $detail.html(res.replace(/\n/g, '<br>'));
            });
        }
    });

    $table.on('all.bs.table', (e, name, args) => {
        console.log(name, args);
    });

    // Edit Book name or price
    $table.on('editable-hidden.bs.table', (...args) => {
        if (args[args.length - 1] === 'save') {
            console.log('SAVING NEW DATA...');
            console.log('New Field is', args[1], '===', args[2][args[1]]);
        }
    });

    $table.on('load-success.bs.table', (e, data) => {
        console.log('LOAD', data);
        $table.bootstrapTable('load', data);
    });

    // Remove a Book
    $remove.click(() => {
        const ids = getIdSelections();

        console.log('REMOVING', ids);

        $table.bootstrapTable('remove', {
            field: 'id',
            values: ids
        });
        $remove.prop('disabled', true);
    });

    $(window).resize(() => {
        $table.bootstrapTable('resetView', {
            height: getHeight()
        });
    });
};


function getIdSelections() {
    return $.map($table.bootstrapTable('getSelections'), row => row.id)
}

function responseHandler(res) {
    console.log('RESPONSE HANDLER...');
    console.log(res);
    $table.bootstrapTable('load', res);
    $.each(res.rows, (i, row) => {
        row.state = $.inArray(row.id, selections) !== -1;
    });
    return res;
};

function detailFormatter(index, row) {
    let html = [];
    // let book = window.BOOKS.find(b => b[0] === row.id);
    delete row['state'];
    console.log($table.bootstrapTable('getData'));
    $.each(row, (key, value) => html.push(`<p><b>${key}</b> ${value}</p>`));
    // html.push(`
    //     <p><b>description:</b> ${book[2]}</p>
    //     <p><b>author:</b> ${book[9]} ${book[10]}</p>
    //     <p><b>publisher:</b> ${book[13]}</p>
    // `);

    return html.join('');
};

function operateFormatter(value, row, index) {
    return [
        '<a class="like" href="javascript:void(0)" title="Like">',
        '<i class="glyphicon glyphicon-heart"></i>',
        '</a>',
        '<a class="remove" href="javascript:void(0)" title="Remove">',
        '<i class="glyphicon glyphicon-remove"></i>',
        '</a>'
    ].join('');
}

function totalTextFormatter(data) { return 'Total'; }

function totalNameFormatter (data) { data.length; }

function totalPriceFormatter(data) {
    let total = 0;

    $.each(data, (i, row) => {
        total += +(row.price.substring(1));
    });

    return '$' + total;
};


window.operateEvents = {
    'click .like': (e, value, row, index) => {
        alert(`You click like button action, row: ${JSON.stringify(row)}`);
    },
    'click .remove': (e, value, row, index) => {
        $table.bootstrapTable('remove', {
            field: 'id',
            values: [row.id]
        });
    }
};


function getHeight() { return $(window).height() - $('h1').outerHeight(true); }


$(() => {
    const scripts = [
            location.search.substring(1) || 'js/bootstrap-table.js',
            'js/bootstrap-table-export.js',
            'http://rawgit.com/hhurz/tableExport.jquery.plugin/master/tableExport.js',
            'js/bootstrap-table-editable.js',
            'http://rawgit.com/vitalets/x-editable/master/dist/bootstrap3-editable/js/bootstrap-editable.js'
        ],
        eachSeries = (arr, iterator, callback) => {
            callback = callback || (() => {});
            if (!arr.length) {
                return callback();
            }
            let completed = 0;
            const iterate = () => {
                iterator(arr[completed], err => {
                    if (err) {
                        callback(err);
                        callback = () => {};
                    }
                    else {
                        completed += 1;
                        if (completed >= arr.length) {
                            callback(null);
                        }
                        else {
                            iterate();
                        }
                    }
                });
            };
            iterate();
        };
    eachSeries(scripts, getScript, initTable);
});

function getScript(url, callback) {
    let head = document.getElementsByTagName('head')[0];
    let script = document.createElement('script');
    script.src = url;
    let done = false;
    // Attach handlers for all browsers
    script.onload = script.onreadystatechange = function() {
        if (!done && (!this.readyState ||
                this.readyState == 'loaded' || this.readyState == 'complete')) {
            done = true;
            if (callback)
                callback();
            // Handle memory leak in IE
            script.onload = script.onreadystatechange = null;
        }
    };
    head.appendChild(script);
    // We handle everything using the script element injection
    return undefined;
}
