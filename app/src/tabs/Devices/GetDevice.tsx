import React from 'react';

import {
    Device,
    DTDL,
    getProperty,
    is,
    Options,
    Props,
    setProperty,
} from '../../data';
import { Api, IotCentral } from '../../providers';
import { Get } from '../../resource';

export default {
    name: 'GetDevice',
    title: 'Get Device',

    async execute(api, id) {
        // Get the device itself
        const device = await api.getDevice(id);
        if (!device) {
            return {};
        }

        // Get the device template (for modeling) and properties (for display)
        const [template, properties] = await Promise.all([
            api.getTemplate(device.template!),
            api.getProperties(device.id),
        ]);

        return { device, template, properties };
    },

    async form(api, { device, template, properties }, setDisplayName) {
        if (!device || !template || !properties) {
            return null;
        }
        setDisplayName(device.displayName);

        // Determine rendering options by capability @type
        const options: Props['options'] = (capability, component) => {
            if (is.Command(capability)) {
                return command(api, device, capability, component);
            }
            if (is.Property(capability)) {
                return property(api, device, properties, capability, component);
            }
            if (is.Telemetry(capability)) {
                return telemetry(api, device, capability, component);
            }
            return {};
        };

        return <Device schema={template.capabilityModel} options={options} />;
    },
} as Get<{
    device?: IotCentral.Device;
    template?: IotCentral.DeviceTemplate;
    properties?: IotCentral.Properties;
}>;

function command(
    api: Api,
    device: IotCentral.Device,
    capability: DTDL.Command,
    component?: DTDL.Component
): Options {
    let set: (value: any) => void;
    const load = async () => {
        // We only show the latest command response,
        // so get the history but only return the first entry
        const response = await api
            .getCommandHistory(device.id, capability.name, component?.name)
            .get(0);
        set(response?.response);
    };
    return {
        load(setValue) {
            set = setValue;
            load();
        },

        // Run and reload the command
        async onEdit(request) {
            set(null);
            await api.runCommand(
                device.id,
                { request },
                capability.name,
                component?.name
            );
            load();
        },
    };
}

function property(
    api: Api,
    device: IotCentral.Device,
    properties: IotCentral.Properties,
    capability: DTDL.Property,
    component?: DTDL.Component
): Options {
    return {
        // Properties can be retrieved with one call, so they are retrieved
        // preemptively and the values are simply returned
        load(setValue) {
            setValue(getProperty(properties, capability, component));
        },

        // Update the current properties and generate a patch body to send
        async onEdit(value) {
            setProperty(properties, value, capability, component);
            const patch = value != null ? value : null;
            const body = setProperty({}, patch, capability, component);
            await api.updateProperties(device.id, body);
        },
    };
}

function telemetry(
    api: Api,
    device: IotCentral.Device,
    capability: DTDL.Telemetry,
    component?: DTDL.Component
): Options {
    let set: (value: any) => void;
    const load = async () => {
        // Telemetry is retrieved with individual calls
        const response = await api.getTelemetry(
            device.id,
            capability.name,
            component?.name
        );
        set(response?.value);
    };
    return {
        load(setValue) {
            set = setValue;
            load();
        },

        onEdit() {
            set(null);
            load();
        },
    };
}
