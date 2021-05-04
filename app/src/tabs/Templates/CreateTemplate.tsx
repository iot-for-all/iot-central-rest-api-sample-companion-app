import React from 'react';
import Highlighter from 'react-native-syntax-highlighter';
import { BarCodeScannerResult } from 'expo-barcode-scanner';

import { Api, IotCentral } from '../../providers';
import { Create } from '../../resource';
import { Scanner } from '../../utility';

import {
    findOrBuildTemplate,
    parseTemplateQr,
    TemplateConfig,
} from '../utility';

export default {
    name: 'CreateTemplate',
    title: 'Create Template',

    async execute(api, { template }) {
        // If the template is new, create it
        if (!template.etag) {
            await api.createTemplate(template['@id'], template);
        }
        return template['@id'];
    },

    async form(api, setData, setDisplayName) {
        setDisplayName('Scan device template QR code');
        return (
            <Scanner
                parse={parseQr}
                render={config => render(api, config, setData, setDisplayName)}
            />
        );
    },
} as Create<Data>;

interface Data {
    template: IotCentral.DeviceTemplate;
}

function parseQr(result: BarCodeScannerResult) {
    const config = parseTemplateQr(result);
    if (!config) {
        throw Error('Invalid device template QR code.');
    }
    return config;
}

async function render(
    api: Api,
    config: TemplateConfig,
    setData: (data: Data) => unknown,
    setDisplayName: (name?: string) => unknown
) {
    const template = await findOrBuildTemplate(
        api,
        config.model,
        config.template['@id'],
        config.template.displayName
    );

    setData({ template });
    setDisplayName(template.displayName);

    return (
        <Highlighter language="json">
            {JSON.stringify(template, null, 2)}
        </Highlighter>
    );
}
