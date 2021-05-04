const { prompt } = require('enquirer');

const { request } = require('../utility');

const MODEL_REPO = 'https://devicemodels.azure.com';

module.exports = async () => {
    const { model } = await prompt({
        type: 'input',
        name: 'model',
        message: 'What is the @id of your capability model?',
    });
    const path = model.replace(/;/g, '-').replace(/:/g, '/').toLowerCase();
    const capabilityModel = await request(
        'Retrieving capability model...',
        `${path}.json`,
        { prefixUrl: MODEL_REPO }
    );
    return { capabilityModel };
};
