import { Remove } from '../../resource';

export default {
    name: 'RemoveTemplate',
    title: 'Removing device template...',
    execute: (api, id) => api.removeTemplate(id),
} as Remove;
