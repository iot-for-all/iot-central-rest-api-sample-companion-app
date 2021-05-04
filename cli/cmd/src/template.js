const { prompt } = require('enquirer');

const IOTC_APP = 'IoT Central Application';
const MODEL_REPO = 'Azure Device Models Repository';
const LOCAL_FILE = 'Local File';

module.exports = async () => {
    const { source } = await prompt({
        type: 'select',
        name: 'source',
        message: 'Where is the capability model for your device template?',
        choices: [IOTC_APP, MODEL_REPO, LOCAL_FILE],
    });
    switch (source) {
        case IOTC_APP:
            return require('./tgt/iotc')();
        case MODEL_REPO:
            return require('./tgt/repo')();
        case LOCAL_FILE:
            return require('./tgt/file')();
    }
};
