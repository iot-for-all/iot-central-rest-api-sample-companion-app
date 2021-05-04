import React from 'react';

import Resource from '../../resource';

import CreateTemplate from './CreateTemplate';
import GetTemplate from './GetTemplate';
import ListTemplates from './ListTemplates';
import RemoveTemplate from './RemoveTemplate';

export default () => (
    <Resource
        list={ListTemplates}
        get={GetTemplate}
        create={CreateTemplate}
        remove={RemoveTemplate}
    />
);
