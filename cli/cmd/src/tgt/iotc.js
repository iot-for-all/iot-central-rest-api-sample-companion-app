const { DeviceCodeCredential } = require('@azure/identity');
const { prompt } = require('enquirer');

const { choices, paged, spin } = require('../utility');

const IOTC_DOMAIN = 'azureiotcentral.com';
const IOTC_TOKEN_SCOPE = 'https://apps.azureiotcentral.com/user_impersonation';

module.exports = async () => getTemplate(await getApplicationUrl());

async function getApplicationUrl() {
    let { application } = await prompt({
        type: 'input',
        name: 'application',
        message: 'Which application has your device template?',
    });
    return new URL(`https://${application}.${IOTC_DOMAIN}`);
}

async function authenticate() {
    let done;
    const { token } = await new DeviceCodeCredential(
        undefined,
        undefined,
        ({ message }) => (done = spin(message))
    ).getToken(IOTC_TOKEN_SCOPE);
    return done(`Bearer ${token}`);
}

async function getTemplate({ origin }) {
    const templates = await paged(
        'Getting device templates...',
        `${origin}/api/deviceTemplates?api-version=1.0`,
        { headers: { authorization: await authenticate() } }
    );
    const { template } = await prompt({
        type: 'select',
        name: 'template',
        message: 'Which device template do you want to use?',
        choices: choices(
            templates.map(template => ({
                name: template.displayName || template['@id'],
                value: template,
            }))
        ),
        result(names) {
            return this.map(names);
        },
    });
    return Object.values(template)[0];
}
