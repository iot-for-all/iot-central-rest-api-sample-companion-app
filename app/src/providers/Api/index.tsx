import React from 'react';
import { URL } from 'react-native-url-polyfill';

import Auth from '../Auth';
import Global from '../Global';

import {
    Command,
    Device,
    DeviceTemplate,
    Page,
    Properties,
    Telemetry,
} from './types';

const IOTC_DOMAIN = 'azureiotcentral.com';

export default class Api {
    listTemplates() {
        return new Collection(
            this,
            this.call<Page<DeviceTemplate>>('GET', 'deviceTemplates')
        );
    }

    getTemplate(templateId: string) {
        return this.call<DeviceTemplate>(
            'GET',
            `deviceTemplates/${templateId}`
        );
    }

    createTemplate(templateId: string, template: DeviceTemplate) {
        return this.call<DeviceTemplate>(
            'PUT',
            `deviceTemplates/${templateId}`,
            template
        );
    }

    removeTemplate(templateId: string) {
        return this.call('DELETE', `deviceTemplates/${templateId}`);
    }

    listDevices() {
        return new Collection(this, this.call<Page<Device>>('GET', 'devices'));
    }

    getDevice(deviceId: string) {
        return this.call<Device>('GET', `devices/${deviceId}`);
    }

    createDevice(deviceId: string, device: Device) {
        return this.call<Device>('PUT', `devices/${deviceId}`, device);
    }

    removeDevice(deviceId: string) {
        return this.call('DELETE', `devices/${deviceId}`);
    }

    getProperties(deviceId: string) {
        return this.call<Properties>('GET', `devices/${deviceId}/properties`);
    }

    replaceProperties(deviceId: string, properties: Properties) {
        return this.call<Properties>(
            'PUT',
            `devices/${deviceId}/properties`,
            properties
        );
    }

    updateProperties(deviceId: string, properties: Properties) {
        return this.call<Properties>(
            'PATCH',
            `devices/${deviceId}/properties`,
            properties
        );
    }

    getTelemetry(
        deviceId: string,
        telemetryName: string,
        componentName?: string
    ) {
        const path = componentName
            ? `devices/${deviceId}/components/${componentName}/telemetry/${telemetryName}`
            : `devices/${deviceId}/telemetry/${telemetryName}`;
        return this.call<Telemetry>('GET', path);
    }

    getCommandHistory(
        deviceId: string,
        commandName: string,
        componentName?: string
    ) {
        const path = componentName
            ? `devices/${deviceId}/components/${componentName}/commands/${commandName}`
            : `devices/${deviceId}/commands/${commandName}`;
        return new Collection(this, this.call<Page<Command>>('GET', path));
    }

    runCommand(
        deviceId: string,
        payload: Command,
        commandName: string,
        componentName?: string
    ) {
        const path = componentName
            ? `devices/${deviceId}/components/${componentName}/commands/${commandName}`
            : `devices/${deviceId}/commands/${commandName}`;
        return this.call<Command>('POST', path, payload);
    }

    // Generic API call
    async call<T = void>(
        method: string,
        path: string | URL,
        body?: any
    ): Promise<T | undefined> {
        if (!this.base || !this.auth) {
            return undefined;
        }

        // Allow for partial-path shorthands or full URLs (to support paging)
        const url =
            path instanceof URL ? path : new URL(`/api/${path}`, this.base);
        url.searchParams.set('api-version', '1.0');
        const headers: HeadersInit = {
            Authorization: `Bearer ${await this.auth.accessToken()}`,
        };
        if (body) {
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify(body);
        }

        // Execute the API call
        const response = await fetch(url.toString(), { method, body, headers });
        if (response.status >= 400) {
            const { error } = await response.json();

            // Allow for caller handling of not-found cases
            if (error.code === 'NotFound') {
                return undefined;
            }

            throw error;
        }
        return response.status !== 204 ? response.json() : undefined;
    }

    constructor(public readonly application?: string, private auth?: Auth) {
        // Normalize the application subdomain into a base URL
        this.base = application && `https://${application}.${IOTC_DOMAIN}`;
    }

    private base?: string;

    static Context: React.Context<Api>;
    static Provider: React.FunctionComponent;
}

// Helper class to handle paged results
export class Collection<T> {
    private api: Api;
    private values: T[];
    private next?: () => Promise<Page<T> | undefined>;

    constructor(api: Api, init: Promise<Page<T> | undefined>) {
        this.api = api;
        this.values = [];
        this.next = () => init;
    }

    async get(index: number) {
        // Retrieve and cache new pages until the requested index is reached
        while (this.next && index >= this.values.length) {
            const { value = [], nextLink } = (await this.next()) || {};
            this.values.push(...value);
            this.next =
                value.length > 0 && nextLink
                    ? () => this.api.call('GET', new URL(nextLink))
                    : undefined;
        }
        return this.values[index];
    }

    async all() {
        await this.get(Number.MAX_SAFE_INTEGER);
        return this.values;
    }
}

Api.Context = React.createContext(new Api());

Api.Provider = ({ children }: React.PropsWithChildren<{}>) => {
    const global = React.useContext(Global.Context);
    const auth = React.useContext(Auth.Context);

    const value = React.useMemo(() => new Api(global.application, auth), [
        global.application,
        auth,
    ]);
    return (
        <Api.Context.Provider value={value}>{children}</Api.Context.Provider>
    );
};
