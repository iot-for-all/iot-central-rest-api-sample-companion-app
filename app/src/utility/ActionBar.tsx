import React from 'react';
import { Appbar } from 'react-native-paper';
import { StackHeaderProps } from '@react-navigation/stack';

// Display a header of action buttons from a list of actions
export default ({ actions, previous, navigation, ...props }: Props) => (
    <Appbar.Header>
        {navigation && previous && (
            <Appbar.BackAction onPress={() => navigation.goBack()} />
        )}
        <Appbar.Content {...props} />
        {(actions || []).map((action, index) => (
            <Appbar.Action key={String(index)} {...action} />
        ))}
    </Appbar.Header>
);

export type Props = Partial<StackHeaderProps> &
    React.ComponentProps<typeof Appbar.Content> & {
        actions?: React.ComponentProps<typeof Appbar.Action>[];
    };
