import React from 'react';
import { TouchableRipple } from 'react-native-paper';

import * as DTDL from './dtdl';
import { Props as CapabilityProps, State } from './props';
import Schema from './Schema';

export default ({ capability, options, stack }: Props) => {
    const { displayName, name, schema } = capability;
    const { load, state = State.Default, onEdit } = React.useMemo(
        () => options(capability, ...(stack || [])),
        [options, capability, stack]
    );

    // If the capability is hidden, bail out and display nothing
    if (state === State.Hidden) {
        return null;
    }

    // Telemetry can't be edited, but provide the onEdit to allow refresh
    return (
        <TouchableRipple
            onPress={onEdit && (() => onEdit(undefined))}
            disabled={state === State.Disabled}
        >
            <Schema
                schema={schema}
                label={displayName || name}
                state={state}
                load={load}
            />
        </TouchableRipple>
    );
};

export type Props = CapabilityProps<DTDL.Telemetry>;
