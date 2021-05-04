import { List } from '../../resource';

import { IotCentral } from '../../providers';

export default {
    name: 'ListDevices',
    title: 'List Devices',
    execute: api => api.listDevices(),
    item: ({ id, displayName }) => ({ icon: 'devices', id, displayName }),
} as List<IotCentral.Device>;
