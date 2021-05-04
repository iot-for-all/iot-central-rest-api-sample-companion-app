import React from 'react';
import { useAsync } from 'react-async-hook';

import { Api } from '../providers';
import { ActionBar, Loading } from '../utility';

import { Factory } from './types';

export default (({ list, get, create }) => ({ navigation }) => {
    const api = React.useContext(Api.Context);

    const [displayName, setDisplayName] = React.useState<string>();
    const [creating, setCreating] = React.useState(false);
    const [data, setData] = React.useState<any>();

    React.useEffect(() => {
        // Display the create button in the header
        const actions = [
            {
                icon: 'check',
                disabled: data == null || creating,
                async onPress() {
                    // Execute the create
                    setCreating(true);
                    const id = await create.execute(api, data);

                    // Reset navigation to the (refreshed) list view
                    // followed by the new resource view
                    navigation.reset({
                        index: 1,
                        routes: [
                            { name: list.name, params: { reset: true } },
                            { name: get.name, params: { id } },
                        ],
                    });
                },
            },
        ];

        navigation.setOptions({
            header: props => (
                <ActionBar
                    {...props}
                    title={create.title}
                    subtitle={displayName}
                    actions={actions}
                />
            ),
        });
    }, [api, navigation, data, displayName, creating]);

    return (
        <Loading loading={creating}>
            {useAsync(create.form, [api, setData, setDisplayName])}
        </Loading>
    );
}) as Factory;
