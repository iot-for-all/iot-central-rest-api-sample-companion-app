import React from 'react';
import { ScrollView } from 'react-native';
import { List } from 'react-native-paper';

// This isn't a particularly user-friendly way to display errors,
// but it is useful as a debugging mechanism
export default ({ error, ...props }: Props) => {
    // Message and stack don't show up in an Error's Object.entries,
    // so pull them out explicitly and append them if present
    const { message, stack, ...rest } = error;
    const entries = Object.entries(rest);
    if (message) {
        entries.unshift(['message', message]);
    }
    if (stack) {
        entries.push(['stack', stack]);
    }

    return (
        <ScrollView {...props}>
            {entries.map(([key, val]) => (
                <List.Item key={key} title={key} description={String(val)} />
            ))}
        </ScrollView>
    );
};

export type Props = React.ComponentProps<typeof ScrollView> & { error: any };
