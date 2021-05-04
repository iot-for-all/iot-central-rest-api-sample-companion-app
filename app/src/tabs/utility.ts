import { BarCodeScannerResult } from 'expo-barcode-scanner';

import { Api, IotCentral } from '../providers';

// Find a template with the appropriate capability model, or build a new one
export async function findOrBuildTemplate(
    api: Api,
    modelId: string,
    templateId?: string,
    displayName?: string
) {
    // Try to find the given template (if specified)
    let template = templateId && (await api.getTemplate(templateId));

    // Try to find a template with the given capability model
    if (!template) {
        template = (await api.listTemplates().all()).find(
            ({ capabilityModel }) => capabilityModel['@id'] === modelId
        );
    }

    // If no existing template was found, create a new one,
    // pulling the capability model from the repository
    if (!template) {
        const capabilityModel = await getModelFromRepo(modelId);
        template = {
            '@id': templateId || createTemplateId(api, modelId),
            '@type': ['ModelDefinition', 'DeviceModel'],
            displayName:
                displayName ||
                capabilityModel.displayName ||
                capabilityModel['@id'],
            capabilityModel,
        };
    }

    return template;
}

// Create a template ID out of a sanitized application subdomain and model ID
function createTemplateId(api: Api, modelId: string) {
    const application = String(api.application);
    const namespace = application.split('.').shift()!.replace(/-/g, '_');
    const identifier = modelId.slice(modelId.indexOf(':') + 1);
    return `dtmi:${namespace}:${identifier}`;
}

// Get a capability model from the Azure Device Models Repository
async function getModelFromRepo(modelId: string) {
    const path = modelId.replace(/;/g, '-').replace(/:/g, '/').toLowerCase();
    const response = await fetch(`${MODEL_REPO}/${path}.json`);
    return response.json();
}
const MODEL_REPO = 'https://devicemodels.azure.com';

// Formatted QR device configuration data
export interface DeviceConfig {
    device: IotCentral.Device;
    model: string;
}

// Parse the device QR data output by the CLI
export function parseDeviceQr(
    scan: BarCodeScannerResult
): DeviceConfig | undefined {
    try {
        const data = parseJsonArray(scan.data);
        const [id, displayName, simulated, enabled, template, model] = data;
        if (typeof model === 'string') {
            return {
                device: { id, displayName, simulated, enabled, template },
                model,
            };
        }
    } catch {}
    return undefined;
}

// Formatted QR template configuration data
export interface TemplateConfig {
    template: Partial<IotCentral.DeviceTemplate>;
    model: string;
}

// Parse the template QR data output by the CLI
export function parseTemplateQr(
    scan: BarCodeScannerResult
): TemplateConfig | undefined {
    try {
        const data = parseJsonArray(scan.data);
        const [id, displayName, model] = data;
        if (typeof model === 'string') {
            return { template: { '@id': id, displayName }, model };
        }
    } catch {}
    return undefined;
}

// Handle the fact that undefined values stringify as null
function parseJsonArray(data: string) {
    return JSON.parse(data, (k, v) => (v != null ? v : undefined));
}
