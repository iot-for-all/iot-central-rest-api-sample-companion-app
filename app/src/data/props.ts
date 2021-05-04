import * as DTDL from './dtdl';

export type Props<T extends DTDL.Capability = DTDL.Capability> = {
    capability: T;
    stack?: DTDL.Component[];
    options: (capability: T, ...stack: DTDL.Component[]) => Options;
};

// Capability options
export type Options = {
    load?: (setValue: (value: any) => void) => unknown;
    onEdit?: (value: any) => unknown;
    state?: State;
    debounce?: number;
};

// Capability display state
export enum State {
    Hidden = 'hidden',
    Default = 'default',
    Disabled = 'disabled',
}
