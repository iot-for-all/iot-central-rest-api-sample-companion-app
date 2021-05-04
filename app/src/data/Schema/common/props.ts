import React from 'react';

import * as DTDL from '../../dtdl';

export type Control<T> = {
    label?: string;
    disabled?: boolean;
    value: T | null | undefined;
    setValue: React.Dispatch<React.SetStateAction<T | undefined>>;
};

export type Schema<T, S = DTDL.Primitive> = Control<T> & {
    schema: S;
};
