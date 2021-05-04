const {
    createWriteStream,
    promises: { readFile },
} = require('fs');

const { image } = require('qr-image');

const { DEFAULT_CONFIG_FILE } = require('./src/utility');

module.exports = {
    command: 'template [id]',
    describe: 'generate QR code for device template import',
    builder(args) {
        return args
            .positional('id', {
                describe: 'ID of the device template to create',
            })
            .option('config', {
                describe: 'configuration file to use',
                default: DEFAULT_CONFIG_FILE,
            })
            .option('displayName', {
                describe: 'display name of the device template',
            })
            .option('output', {
                describe: 'output file override',
            });
    },

    async handler({ config, id, displayName, output }) {
        const conf = JSON.parse(await readFile(config, 'utf8'));
        const body = [id || conf.template, displayName, conf.model];
        const filename = (body[0] || conf.model).replace(/[^\w]/g, '_');
        const file = output || `${filename}.png`;
        image(JSON.stringify(body)).pipe(createWriteStream(file));
    },
};
