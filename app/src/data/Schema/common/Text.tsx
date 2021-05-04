import React from 'react';
import { ActivityIndicator, TextInput } from 'react-native-paper';

import { Control as ControlProps } from './props';

// Helper for rendering capabilities that display as text
export default <T extends unknown>({
    disabled,
    value,
    setValue,
    parse,
    stringify,
    ...props
}: Props<T>) => (
    <TextInput
        mode="outlined"
        style={{ margin: 8 }}
        value={value != null ? stringify(value) : ''}
        onChangeText={text => setValue(text ? parse(text) : undefined)}
        editable={!disabled}
        render={
            // Explicitly null values are loading (rather than empty),
            // so display a loading indicator in place of the text
            value === null
                ? ({ style }) => <ActivityIndicator style={style} />
                : undefined
        }
        {...props}
    />
);

export type Props<T> = Omit<React.ComponentProps<typeof TextInput>, 'value'> &
    ControlProps<T> & {
        parse: (str: string) => T;
        stringify: (val: T) => string;
    };
