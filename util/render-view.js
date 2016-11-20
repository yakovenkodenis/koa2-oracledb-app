const fs = require('fs-promise');
const Handlebars = require('handlebars');


const renderView = async (viewUrl, data) => {
    const view = await fs.readFile(viewUrl, 'utf8');
    const template = Handlebars.compile(view);
    return template(data);
}

module.exports = renderView;
