import React from 'react';
import { List } from 'react-native-paper';

import * as DTDL from '../dtdl';
import { Options, State } from '../props';

import { Schema as SchemaProps } from './common/props';
import BooleanCapability from './Boolean';
import DateTimeCapability from './DateTime';
import EnumCapability from './Enum';
import NumberCapability from './Number';
import StringCapability from './String';

const SCHEMA_COMPONENT: {
    [schema: string]: (props: SchemaProps<any, any>) => JSX.Element | null;
} = {
    boolean: BooleanCapability,
    date: DateTimeCapability,
    dateTime: DateTimeCapability,
    double: NumberCapability,
    Enum: EnumCapability,
    float: NumberCapability,
    integer: NumberCapability,
    long: NumberCapability,
    string: StringCapability,
    time: DateTimeCapability,
};

export default ({ schema, label, load, onEdit, state, debounce }: Props) => {
    // If the capability is hidden, bail out and display nothing
    if (state === State.Hidden) {
        return null;
    }

    // Get the string type of a potentially complex schema
    const type = String(typeof schema === 'object' ? schema['@type'] : schema);
    if (!SCHEMA_COMPONENT[type]) {
        // If the capability is unsupported, display a placeholder
        return <List.Item title={label} />;
    }

    // Initialize to a null (loading) value if the load callback is present
    const [[value], dispatch] = React.useReducer(debouncer, [load && null]);

    React.useEffect(() => {
        load && load(value => dispatch({ value }));
    }, [load]);

    return SCHEMA_COMPONENT[type]({
        schema,
        label,
        value,
        disabled: state === State.Disabled || !onEdit,
        setValue: (value: any) => dispatch({ value, onEdit, debounce }),
    });
};

// Debounce user edits to execute callback only when the edit is complete
type Debouncer = React.Reducer<
    [any, any?],
    { value: any; onEdit?: (value: any) => unknown; debounce?: number }
>;
const debouncer: Debouncer = ([prev, bounce], { value, onEdit, debounce }) => {
    clearTimeout(bounce);
    const next = typeof value === 'function' ? value(prev) : value;
    return [next, onEdit && setTimeout(() => onEdit(next), debounce)];
};

export type Props = Options & {
    label: string;
    schema?: DTDL.Schema;
};
