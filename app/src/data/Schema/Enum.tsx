import React from 'react';
import { Menu } from 'react-native-paper';

import * as DTDL from '../dtdl';

import * as Props from './common/props';
import TextAnchor from './common/TextAnchor';

function stringify({ enumValues }: DTDL.Enum, value: string | number) {
    const { displayName, name } =
        enumValues.find(({ enumValue }) => enumValue === value) || {};
    return displayName || name || '';
}

// Enum capabilities display as a text field,
// but are edited via a menu of their options
export default ({
    schema,
    setValue,
    ...props
}: Props.Schema<string | number, DTDL.Enum>) => {
    const [open, setOpen] = React.useState(false);
    return (
        <Menu
            visible={open}
            onDismiss={() => setOpen(false)}
            anchor={
                <TextAnchor
                    {...props}
                    onPress={() => setOpen(true)}
                    stringify={value => stringify(schema, value)}
                />
            }
        >
            {schema.enumValues.map(({ enumValue, displayName, name }) => (
                <Menu.Item
                    key={String(enumValue)}
                    onPress={() => {
                        setValue(enumValue);
                        setOpen(false);
                    }}
                    title={displayName || name}
                />
            ))}
        </Menu>
    );
};
