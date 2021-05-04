import React from 'react';
import { View } from 'react-native';
import { Divider, List } from 'react-native-paper';

import * as DTDL from './dtdl';
import { Props as CapabilityProps } from './props';
import Command from './Command';
import Property from './Property';
import Telemetry from './Telemetry';
import { is } from './utility';

// Components are displayed as a collapsible block within their parent interface
export const Component = ({
    capability,
    stack,
    ...props
}: CapabilityProps<DTDL.Component>) => {
    const { name, displayName, schema } = capability;
    return (
        <List.Accordion title={displayName || name}>
            <Divider />
            <Interface
                {...props}
                schema={schema}
                stack={[capability, ...(stack || [])]}
            />
            <Divider />
        </List.Accordion>
    );
};

// An interface is displayed as a simple list of its capabilities
// (including the capabilities of any extended interfaces)
export const Interface = ({ schema, ...props }: Props) => {
    const capabilities = [];

    for (const capability of schema.contents || []) {
        const { name } = capability;

        if (is.Command(capability)) {
            capabilities.push(
                <Command {...props} key={name} capability={capability} />
            );
        }

        if (is.Property(capability)) {
            capabilities.push(
                <Property {...props} key={name} capability={capability} />
            );
        }

        if (is.Telemetry(capability)) {
            capabilities.push(
                <Telemetry {...props} key={name} capability={capability} />
            );
        }

        if (is.Component(capability)) {
            capabilities.push(
                <Component {...props} key={name} capability={capability} />
            );
        }
    }

    for (const parent of schema.extends || []) {
        capabilities.push(
            <Interface {...props} key={parent['@id']} schema={parent} />
        );
    }

    return <View>{capabilities}</View>;
};

export default Interface;

export type Props = Omit<CapabilityProps<any>, 'capability'> & {
    schema: DTDL.Interface;
};
