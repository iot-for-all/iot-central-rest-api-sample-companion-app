const got = require('got');
const ora = require('ora');

// Default config file location shared between commands
const DEFAULT_CONFIG_FILE = 'config.json';

// Sort (multi)select choices
function choices(choices) {
    return choices.sort((a, b) => a.name.localeCompare(b.name));
}

// CLI spinner helper for consistent formatting
function spin(text) {
    const spinner = ora({ text, spinner: 'line' }).start();
    return async value => {
        const result = await value;
        spinner.stop();
        return result;
    };
}

// Execute HTTP request with CLI spinner
async function request(comment, url, options) {
    return spin(comment)(got(url, options).json());
}

// Execute HTTP request with paged response
async function paged(comment, url, options) {
    let response = { value: [], nextLink: url };
    const results = [];
    const done = spin(comment);
    do {
        response = await got(response.nextLink, options).json();
        results.push(...response.value);
    } while (response.nextLink && response.value.length > 0);
    return done(results);
}

module.exports = {
    DEFAULT_CONFIG_FILE,
    choices,
    spin,
    request,
    paged,
};
