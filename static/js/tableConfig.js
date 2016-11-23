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
                    title: 'Item ID',
                    field: 'id',
                    rowspan: 2,
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    footerFormatter: totalTextFormatter
                }, {
                    title: 'Item Detail',
                    colspan: 3,
                    align: 'center'
                }
            ],
            [
                {
                    field: 'name',
                    title: 'Item Name',
                    sortable: true,
                    editable: true,
                    align: 'center',
                    footerFormatter: totalNameFormatter
                }, {
                    field: 'price',
                    title: 'Item Price',
                    sortable: true,
                    align: 'center',
                    editable: {
                        type: 'text',
                        title: 'Item Price',
                        validate(value) {
                            value = $.trim(value);
                            
                            if (!value) {
                                return 'This field is required';
                            }

                            if (!/^\$/.test(value)) {
                                return 'Thsi field need to start with $';
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
                    title: 'Item Operate',
                    align: 'center',
                    events: operateEvents,
                    formatter: operateFormatter
                }
            ]
        ],

        data: [
            {
                id: 1,
                name: 'Item 1',
                price: '$1'
            },
            {
                id: 2,
                name: 'Item 2',
                price: '$2'
            }
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

    $remove.click(() => {
        const ids = getIdSelections();

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


const getIdSelections = () => $.map($table.bootstrapTable('getSelections'), row => row.id);

const responseHandler = (res) => {
    $.each(res.rows, (i, row) => {
        row.state = $.inArray(row.id, selections) !== -1;
    });
    return res;
};

const detailFormatter = (index, row) => {
    let html = [];
    $.each(row, (key, value) => {
        html.push(`<p><b>${key}</b> ${value}</p>`);
    });
    return html.join('');
};

const operateFormatter = (value, row, index) => [
    '<a class="like" href="javascript:void(0)" title="Like">',
    '<i class="glyphicon glyphicon-heart"></i>',
    '</a>',
    '<a class="remove" href="javascript:void(0)" title="Remove">',
    '<i class="glyphicon glyphicon-remove"></i>',
    '</a>'
].join('');

const totalTextFormatter = data => 'Total';

const totalNameFormatter = data => data.length;

const totalPriceFormatter = data => {
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


const getHeight = () => $(window).height() - $('h1').outerHeight(true);


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

const getScript = (url, callback) => {
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
