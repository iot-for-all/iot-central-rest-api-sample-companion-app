import React from 'react';
import { BarCodeScannerResult } from 'expo-barcode-scanner';

import { Device, is, Props, setProperty, State } from '../../data';
import { Api, IotCentral } from '../../providers';
import { Create } from '../../resource';
import { Scanner } from '../../utility';

import { DeviceConfig, findOrBuildTemplate, parseDeviceQr } from '../utility';

export default {
    name: 'CreateDevice',
    title: 'Create Device',

    async execute(api, { device, template, properties }) {
        // If the template is new, create it first
        if (!template.etag) {
            await api.createTemplate(template['@id'], template);
        }

        // Create device and set initial properties
        await api.createDevice(device.id, device);
        await api.replaceProperties(device.id, properties);

        return device.id;
    },

    async form(api, setData, setDisplayName) {
        setDisplayName('Scan device QR code');
        return (
            <Scanner
                parse={parseQr}
                render={config => render(api, config, setData, setDisplayName)}
            />
        );
    },
} as Create<Data>;

interface Data {
    device: IotCentral.Device;
    template: IotCentral.DeviceTemplate;
    properties: IotCentral.Properties;
}

function parseQr(result: BarCodeScannerResult) {
    const config = parseDeviceQr(result);
    if (!config) {
        throw Error('Invalid device QR code.');
    }
    return config;
}

async function render(
    api: Api,
    config: DeviceConfig,
    setData: (data: Data) => unknown,
    setDisplayName: (name?: string) => unknown
) {
    const template = await findOrBuildTemplate(
        api,
        config.model,
        config.device.template
    );
    const device = {
        ...config.device,
        displayName: config.device.displayName || config.device.id,
        template: template['@id'],
    };
    const properties = {};

    setData({ device, template, properties });
    setDisplayName(device.displayName);

    return (
        <Device
            schema={template.capabilityModel}
            options={options(properties)}
        />
    );
}

function options(properties: IotCentral.Properties): Props['options'] {
    return (capability, ...stack) => {
        // Filter to writable properties
        if (!is.Property(capability) || !capability.writable) {
            return { state: State.Hidden };
        }

        return {
            // Collect configured values for initialization
            onEdit: value =>
                setProperty(properties, value, capability, ...stack),

            // No API calls are made until the user clicks the
            // create button, so there is no need to debounce
            debounce: 0,
        };
    };
}
