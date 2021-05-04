import React from 'react';

import * as Props from './common/props';
import Text from './common/Text';

// String capabilities display as simple text fields
export default (props: Props.Schema<string>) => (
    <Text {...props} parse={i => i} stringify={String} />
);
