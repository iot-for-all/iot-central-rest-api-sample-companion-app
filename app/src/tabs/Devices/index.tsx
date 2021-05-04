import React from 'react';

import Resource from '../../resource';

import CreateDevice from './CreateDevice';
import GetDevice from './GetDevice';
import ListDevices from './ListDevices';
import RemoveDevice from './RemoveDevice';

export default () => (
    <Resource
        list={ListDevices}
        get={GetDevice}
        create={CreateDevice}
        remove={RemoveDevice}
    />
);
