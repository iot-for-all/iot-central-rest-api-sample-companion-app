const {
    createWriteStream,
    promises: { readFile },
} = require('fs');

const { image } = require('qr-image');

const { DEFAULT_CONFIG_FILE } = require('./src/utility');

module.exports = {
    command: 'device <id>',
    describe: 'generate QR code for device registration',
    builder(args) {
        return args
            .positional('id', {
                describe: 'ID of the device to register',
            })
            .option('config', {
                describe: 'configuration file to use',
                default: DEFAULT_CONFIG_FILE,
            })
            .option('displayName', {
                describe: 'display name of the device',
            })
            .option('simulated', {
                describe: 'simulated status of the device',
                type: 'boolean',
            })
            .option('enabled', {
                describe: 'enabled status of the device',
                type: 'boolean',
            })
            .option('output', {
                describe: 'output file override',
            });
    },

    async handler({ config, id, displayName, simulated, enabled, output }) {
        const conf = JSON.parse(await readFile(config, 'utf8'));
        const body = [
            id,
            displayName,
            simulated,
            enabled,
            conf.template,
            conf.model,
        ];
        const file = output || `${id}.png`;
        image(JSON.stringify(body)).pipe(createWriteStream(file));
    },
};
