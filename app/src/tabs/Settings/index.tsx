import React from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';

import { Global } from '../../providers';
import { ActionBar } from '../../utility';

export default () => {
    const global = React.useContext(Global.Context);
    return (
        <View>
            <ActionBar title="Settings" />
            <TextInput
                label="Application"
                value={global.application}
                onChangeText={text => (global.application = text)}
                mode="outlined"
                style={{ margin: 8 }}
            />
        </View>
    );
};
