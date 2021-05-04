import React from 'react';
import { AsyncState } from 'react-async-hook';
import { ActivityIndicator } from 'react-native-paper';

import Error from './Error';
import Styles from './styles';

// Show a waiting indicator while a promise resolves to the actual display
export default ({ children, ...props }: Props) => {
    // If the promise is pending, display the waiting indicator
    if (props.loading || children.loading) {
        return <ActivityIndicator style={Styles.fill} size="large" />;
    }

    // If the promise failed, display the error
    if (props.error || children.error) {
        return <Error error={props.error || children.error} />;
    }

    // If the promise succeeded, display the result
    return props.result || children.result || null;
};

export type Props = Partial<AsyncElement> & { children: AsyncElement };

export type AsyncElement = AsyncState<JSX.Element | null>;
