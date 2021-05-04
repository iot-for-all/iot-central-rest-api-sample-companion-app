import React from 'react';
import { View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import * as Props from './common/props';
import Styles from './common/styles';
import TextAnchor from './common/TextAnchor';

type DateLike = Date | string | null | undefined;
const toDate = (value: DateLike) => (value ? new Date(value) : new Date());

const PARSE = {
    date: (value: DateLike) => toDate(value).toISOString().split('T')[0],
    time: (value: DateLike) => toDate(value).toISOString().split('T')[1],
};

const STRINGIFY = {
    date: (value: DateLike) => toDate(value).toLocaleDateString(),
    time: (value: DateLike) => toDate(value).toLocaleTimeString(),
};

const DateOrTime = ({
    mode,
    value,
    setValue,
    ...props
}: Props.Control<string> & { mode: 'date' | 'time' }) => {
    const [open, setOpen] = React.useState(false);
    return (
        <View style={Styles.fill}>
            <TextAnchor
                {...props}
                onPress={() => setOpen(true)}
                stringify={STRINGIFY[mode]}
                value={value}
            />
            {open && (
                <DateTimePicker
                    mode={mode}
                    value={toDate(value)}
                    onChange={(event, date) => {
                        setOpen(false);
                        if (event.type === 'set') {
                            setValue(PARSE[mode](date));
                        }
                    }}
                />
            )}
        </View>
    );
};

const DateTime = ({ setValue, ...props }: Props.Control<string>) => (
    <View style={{ flexDirection: 'row' }}>
        <DateOrTime
            {...props}
            mode="date"
            setValue={value => setValue(prev => `${value}T${PARSE.time(prev)}`)}
        />
        <DateOrTime
            {...props}
            mode="time"
            label=""
            setValue={value => setValue(prev => `${PARSE.date(prev)}T${value}`)}
        />
    </View>
);

// Date/time capabilities display as a text field with
// localized stringification and a specialized picker
export default ({ schema, ...props }: Props.Schema<string>) => {
    switch (schema) {
        case 'dateTime':
            return <DateTime {...props} />;
        case 'date':
        case 'time':
            return <DateOrTime mode={schema} {...props} />;
        default:
            return null;
    }
};
