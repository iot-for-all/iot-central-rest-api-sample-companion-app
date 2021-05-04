import React from 'react';
import { useAsync } from 'react-async-hook';
import { ScrollView } from 'react-native';
import { List } from 'react-native-paper';

import { Api } from '../providers';
import { ActionBar, Loading } from '../utility';

import { Factory } from './types';

export default (({ list, get, create }) => ({ route, navigation }) => {
    const api = React.useContext(Api.Context);

    // Execute the list operation and display items for the resulting values
    const result = useAsync(
        async (api: Api, { navigate }: typeof navigation) => {
            // NOTE: For simplicity, this call simply gets all pages and renders
            // them immediately via ScrollView; this is poorly optimized for
            // large lists, and should be converted to progressive rendering
            const resources = await list.execute(api).all();

            const items = resources.map(resource => {
                const { id, displayName, icon } = list.item(resource);
                return (
                    <List.Item
                        key={id}
                        title={displayName || id}
                        description={id}
                        left={props => <List.Icon {...props} icon={icon} />}
                        onPress={() => navigate(get.name, { id })}
                    />
                );
            });
            return <ScrollView>{items}</ScrollView>;
        },
        [api, navigation]
    );

    // Support automatically refreshing the list after edits
    React.useEffect(() => {
        if (route.params.reset) {
            navigation.setParams({ reset: false });
            result.execute(api, navigation);
        }
    }, [api, navigation, route.params.reset]);

    React.useEffect(() => {
        // Display manual-refresh and create-new buttons in the header
        const actions = [
            {
                icon: 'refresh',
                onPress: () => result.execute(api, navigation),
            },
            {
                icon: 'plus',
                onPress: () => navigation.navigate(create.name, {}),
            },
        ];

        navigation.setOptions({
            header: props => (
                <ActionBar {...props} title={list.title} actions={actions} />
            ),
        });
    }, [api, navigation, result]);

    return <Loading>{result}</Loading>;
}) as Factory;
