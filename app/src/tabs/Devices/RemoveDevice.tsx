import { Remove } from '../../resource';

export default {
    name: 'RemoveDevice',
    title: 'Removing device...',
    execute: (api, id) => api.removeDevice(id),
} as Remove;
