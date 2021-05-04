import { DTDL } from '../../data';

// IoT Central API types used by this project

export interface Device {
    readonly id: string;
    template?: string;
    displayName?: string;
    simulated?: boolean;
    enabled?: boolean;
    readonly provisioned?: boolean;
}

export interface DeviceTemplate {
    readonly '@id': string;
    '@type': string[];
    capabilityModel: DTDL.Interface;
    displayName?: string;
    etag?: string;
}

export interface Command {
    request?: any;
    readonly response?: any;
}

export interface Properties {
    [name: string]: any;
}

export interface Telemetry {
    value: any;
    timestamp: string;
}

export interface Page<T> {
    value?: T[];
    nextLink?: string;
}
