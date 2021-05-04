import React from 'react';
import { View } from 'react-native';
import { Button, Dialog, Portal, TouchableRipple } from 'react-native-paper';

import * as DTDL from './dtdl';
import { Props as CapabilityProps, State } from './props';
import Schema from './Schema';

export default ({ capability, options, stack }: Props) => {
    const [open, setOpen] = React.useState(false);
    const [body, setBody] = React.useState<any>();

    const { displayName, name, request, response } = capability;
    const { load, onEdit, state = State.Default } = React.useMemo(
        () => options(capability, ...(stack || [])),
        [options, capability, stack]
    );

    // If the capability is hidden, bail out and display nothing
    if (state === State.Hidden) {
        return null;
    }

    // Generate controls for both the request and response schemas
    const req = (
        <Schema
            schema={request?.schema}
            label={request?.displayName || displayName || request?.name || name}
            state={state}
            onEdit={setBody}
        />
    );
    const res = (
        <Schema
            schema={response?.schema}
            label={displayName || response?.displayName || name}
            state={state}
            load={load}
        />
    );

    let dialog: JSX.Element | null = null;
    let onPress: () => unknown = () => {};
    if (onEdit) {
        if (request) {
            // If there is a request body, generate a form dialog for it
            onPress = () => setOpen(true);
            const onSend = () => {
                onEdit(body);
                setOpen(false);
            };
            dialog = (
                <Portal>
                    <Dialog visible={open} onDismiss={() => setOpen(false)}>
                        <Dialog.Content>{req}</Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={onSend}>Send</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            );
        } else {
            // If there is no request body, pressing the command sends directly
            onPress = () => onEdit(undefined);
        }
    }

    return (
        <View>
            <TouchableRipple
                onPress={onPress}
                disabled={state === State.Disabled}
            >
                {res}
            </TouchableRipple>
            {dialog}
        </View>
    );
};

export type Props = CapabilityProps<DTDL.Command>;
