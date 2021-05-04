import { List } from '../../resource';

import { IotCentral } from '../../providers';

export default {
    name: 'ListTemplates',
    title: 'List Templates',
    execute: api => api.listTemplates(),
    item: ({ '@id': id, displayName }) => ({
        icon: 'code-json',
        id,
        displayName,
    }),
} as List<IotCentral.DeviceTemplate>;
