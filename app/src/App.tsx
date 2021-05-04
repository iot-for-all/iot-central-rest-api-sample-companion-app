import React from 'react';
import * as Paper from 'react-native-paper';
import * as Navigation from '@react-navigation/native';
import { registerRootComponent } from 'expo';

import { Api, Auth, Global, Storage } from './providers';
import Tabs from './tabs';

const THEME = {
    ...Paper.DefaultTheme,
    colors: {
        ...Navigation.DefaultTheme.colors,
        ...Paper.DefaultTheme.colors,
        primary: '#136bfb',
    },
    roundness: 8,
};

export default registerRootComponent(() => (
    <Storage.Provider>
        <Global.Provider>
            <Paper.Provider theme={THEME}>
                <Navigation.NavigationContainer theme={THEME}>
                    <Auth.Provider>
                        <Api.Provider>
                            <Tabs />
                        </Api.Provider>
                    </Auth.Provider>
                </Navigation.NavigationContainer>
            </Paper.Provider>
        </Global.Provider>
    </Storage.Provider>
));
