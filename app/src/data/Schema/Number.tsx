import React from 'react';

import * as Props from './common/props';
import Text from './common/Text';

function keyboard(schema: string | object) {
    switch (schema) {
        case 'double':
        case 'float':
            return 'decimal-pad';
        case 'integer':
        case 'long':
            return 'number-pad';
        default:
            return 'numeric';
    }
}

// Number capabilities display as text fields, with specific keyboard inputs
export default ({ schema, ...props }: Props.Schema<number>) => (
    <Text
        {...props}
        parse={Number}
        stringify={String}
        keyboardType={keyboard(schema)}
    />
);
