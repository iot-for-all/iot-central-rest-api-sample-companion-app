import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Create from './Create';
import Get from './Get';
import List from './List';
import { Definition } from './types';

const Stack = createStackNavigator();

// Generic resource stack screen, including list (with create button),
// get (with delete button), and create screens
export default <L, G, C>(definition: Definition<L, G, C>) => (
    <Stack.Navigator initialRouteName={definition.list.name}>
        <Stack.Screen
            name={definition.list.name}
            component={React.useMemo(() => List(definition), [])}
            initialParams={{ reset: false }}
        />
        <Stack.Screen
            name={definition.get.name}
            component={React.useMemo(() => Get(definition), [])}
        />
        <Stack.Screen
            name={definition.create.name}
            component={React.useMemo(() => Create(definition), [])}
        />
    </Stack.Navigator>
);

export * from './types';
