const { writeFile } = require('fs').promises;

const getTemplate = require('./src/template');
const { DEFAULT_CONFIG_FILE } = require('./src/utility');

module.exports = {
    command: 'config [file]',
    describe: 'configuration wizard',
    builder(args) {
        return args.positional('file', {
            describe: 'configuration file to generate',
            default: DEFAULT_CONFIG_FILE,
        });
    },

    async handler({ file }) {
        const { id, capabilityModel } = await getTemplate();
        const body = { template: id, model: capabilityModel['@id'] };
        await writeFile(file, JSON.stringify(body));
    },
};
