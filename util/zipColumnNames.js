const zipObject = require('lodash/zipObject');


const zipColumnNames = (columnNames, row) => {
    columns = columnNames.map(c => c.name.toLowerCase());
    return zipObject(columns, row);
}

module.exports = zipColumnNames;
