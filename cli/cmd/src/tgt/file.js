const { readFile } = require('fs').promises;

const { prompt } = require('enquirer');

module.exports = async () => {
    const { file } = await prompt({
        type: 'input',
        name: 'file',
        message: 'Where is your device template or capability model JSON file?',
    });
    const capabilityModel = JSON.parse(await readFile(file, 'utf8'));
    return 'capabilityModel' in capabilityModel
        ? capabilityModel
        : { capabilityModel };
};
