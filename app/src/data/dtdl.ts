// This is a subset of the DTDLv2 definitions useful for this project
// https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md

export interface Interface {
    '@id': string;
    '@type': 'Interface';
    contents?: Capability[];
    displayName?: string;
    extends?: Interface[];
}

export type Capability = Telemetry | Property | Command | Component;

export interface Telemetry {
    '@type': 'Telemetry' | string[];
    name: string;
    schema: Schema;
    displayName?: string;
}

export interface Property {
    '@type': 'Property' | string[];
    name: string;
    schema: Schema;
    displayName?: string;
    writable?: boolean;
}

export interface Command {
    '@type': 'Command';
    name: string;
    displayName?: string;
    request?: CommandPayload;
    response?: CommandPayload;
}

export interface CommandPayload {
    name: string;
    schema: Schema;
    displayName?: string;
}

export interface Component {
    '@type': 'Component';
    name: string;
    schema: Interface;
    displayName?: string;
}

export type Schema = Primitive | Enum;

export type Primitive =
    | 'boolean'
    | 'date'
    | 'dateTime'
    | 'double'
    | 'duration'
    | 'float'
    | 'integer'
    | 'long'
    | 'string'
    | 'time';

export interface Enum {
    '@type': 'Enum';
    enumValues: EnumValue[];
    valueSchema: 'integer' | 'string';
    displayName?: string;
}

export interface EnumValue {
    name: string;
    enumValue: number | string;
    displayName?: string;
}
