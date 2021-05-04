import React from 'react';
import { ScrollView } from 'react-native';

import Interface from './Interface';

// Devices are displayed as a scrollable container for their root interface
export default ({ schema, options, ...props }: Props) => (
    <ScrollView {...props}>
        <Interface options={options} schema={schema} />
    </ScrollView>
);

export type Props = React.ComponentProps<typeof ScrollView> &
    React.ComponentProps<typeof Interface>;
