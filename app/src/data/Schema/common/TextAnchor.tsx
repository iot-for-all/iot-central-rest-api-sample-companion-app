import React from 'react';
import { TouchableRipple } from 'react-native-paper';

import Text, { Props as TextProps } from './Text';

// Touchable anchor for text displays that require an external editor
export default <T extends unknown>({
    onPress,
    disabled,
    ...props
}: Props<T>) => (
    <TouchableRipple onPress={onPress} disabled={disabled}>
        <Text {...props} editable={false} setValue={NEVER} parse={NEVER} />
    </TouchableRipple>
);

const NEVER: (args: any) => any = () => {};

export type Props<T> = Omit<TextProps<T>, 'setValue' | 'parse'> & {
    onPress?: React.ComponentProps<typeof TouchableRipple>['onPress'];
};
