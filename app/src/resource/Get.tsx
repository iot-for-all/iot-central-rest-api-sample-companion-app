import React from 'react';
import { useAsync } from 'react-async-hook';
import { View } from 'react-native';
import { Snackbar } from 'react-native-paper';

import { Api } from '../providers';
import { ActionBar, Loading, Styles } from '../utility';

import { Factory } from './types';

export default (({ list, get, remove }) => ({ route, navigation }) => {
    const api = React.useContext(Api.Context);

    const [displayName, setDisplayName] = React.useState<string>();
    const [deleting, setDeleting] = React.useState(false);

    // Execute the get operation and display the form for the resulting value
    const result = useAsync(
        async (api: Api, id: string, display: typeof setDisplayName) =>
            get.form(api, await get.execute(api, id), display),
        [api, route.params.id, setDisplayName]
    );

    React.useEffect(() => {
        // Display manual-refresh and delete buttons in the header
        const actions = [
            {
                icon: 'refresh',
                disabled: deleting,
                onPress() {
                    result.execute(api, route.params.id, setDisplayName);
                },
            },
            {
                icon: 'delete',
                disabled: deleting,
                async onPress() {
                    // Execute the delete and return to the list
                    setDeleting(true);
                    await remove.execute(api, route.params.id);
                    navigation.navigate(list.name, { reset: true });
                },
            },
        ];

        navigation.setOptions({
            header: props => (
                <ActionBar
                    {...props}
                    title={get.title}
                    subtitle={displayName || route.params.id}
                    actions={actions}
                />
            ),
        });
    }, [api, navigation, route.params.id, displayName, deleting, result]);

    return (
        <View style={Styles.fill}>
            <Loading loading={deleting}>{result}</Loading>
            <Snackbar visible={deleting} onDismiss={() => {}}>
                {remove.title}
            </Snackbar>
        </View>
    );
}) as Factory;
