import React from 'react';

import * as DTDL from './dtdl';
import { Props as CapabilityProps, State } from './props';
import Schema from './Schema';

export default ({ capability, options, stack }: Props) => {
    const { displayName, name, schema, writable } = capability;
    const {
        load,
        onEdit,
        state = State.Default,
        debounce = 1000,
    } = React.useMemo(() => options(capability, ...(stack || [])), [
        options,
        capability,
        stack,
    ]);
    return (
        <Schema
            schema={schema}
            label={displayName || name}
            state={writable || state !== State.Default ? state : State.Disabled}
            load={load}
            onEdit={onEdit}
            debounce={debounce}
        />
    );
};

export type Props = CapabilityProps<DTDL.Property>;
