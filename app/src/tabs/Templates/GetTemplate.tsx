import React from 'react';
import Highlighter from 'react-native-syntax-highlighter';

import { IotCentral } from '../../providers';
import { Get } from '../../resource';

export default {
    name: 'GetTemplate',
    title: 'Get Template',

    async execute(api, id) {
        return api.getTemplate(id);
    },

    async form(api, template, setDisplayName) {
        if (!template) {
            return null;
        }
        setDisplayName(template.displayName);

        return (
            <Highlighter language="json">
                {JSON.stringify(template, null, 2)}
            </Highlighter>
        );
    },
} as Get<IotCentral.DeviceTemplate | undefined>;
