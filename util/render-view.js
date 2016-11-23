/* @flow weak */

const fs = require('fs-promise');
const Handlebars = require('handlebars');
const layouts = require('handlebars-layouts');


const registerPartials = (HandlebarsEngine, partialsDir) => {
    const filenames = fs.readdirSync(partialsDir);

    filenames.forEach(filename => {
        let matches = /^([^.]+).hbs$/.exec(filename);

        if (!matches) return;

        const name = matches[1];
        const template = fs.readFileSync(`${partialsDir}/${filename}`, 'utf8');
        HandlebarsEngine.registerPartial(name, template);
    });
};

const configHandleBars = (HandlebarsEngine) => {

    const partialsDirs = ['www/partials', 'www/layouts'];
    partialsDirs.forEach(dir => registerPartials(HandlebarsEngine, dir));

    layouts.register(HandlebarsEngine);

    return async (viewUrl, data) => {
        const view = await fs.readFile(viewUrl, 'utf8');
        const template = HandlebarsEngine.compile(view);
        return template(data);
    }
}


module.exports = configHandleBars(Handlebars);
