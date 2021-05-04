import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import Devices from './Devices';
import Settings from './Settings';
import Templates from './Templates';

const Tab = createMaterialBottomTabNavigator();

export default () => (
    <Tab.Navigator shifting={true} initialRouteName="Devices">
        <Tab.Screen
            name="Devices"
            component={Devices}
            options={{ tabBarIcon: 'devices' }}
        />
        <Tab.Screen
            name="Templates"
            component={Templates}
            options={{ tabBarIcon: 'code-json', title: 'Device Templates' }}
        />
        <Tab.Screen
            name="Settings"
            component={Settings}
            options={{ tabBarIcon: 'cog' }}
        />
    </Tab.Navigator>
);
