import React from 'react';
import { ActivityIndicator, Checkbox, List } from 'react-native-paper';

import * as Props from './common/props';

function status(value?: boolean) {
    switch (value) {
        case true:
            return 'checked';
        case false:
            return 'unchecked';
        default:
            return 'indeterminate';
    }
}

// Boolean capabilities display as a checkbox
export default ({
    label,
    disabled,
    value,
    setValue,
}: Props.Schema<boolean>) => (
    <List.Item
        title={label}
        left={props =>
            // Explicitly null values are loading (rather than empty),
            // so display a loading indicator in place of the checkbox
            value === null ? (
                <ActivityIndicator />
            ) : (
                <Checkbox
                    {...props}
                    status={status(value)}
                    onPress={() => setValue(val => !val)}
                    disabled={disabled}
                />
            )
        }
        onPress={() => setValue(val => !val)}
        disabled={disabled}
    />
);
