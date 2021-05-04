import * as DTDL from './dtdl';

// Helper to test for a particular JSON-LD @type
export function is<T>(type: string) {
    return (entity: any): entity is T =>
        toArray(entity['@type']).includes(String(type));
}

// Shorthands for capability types
is.Command = is<DTDL.Command>('Command');
is.Property = is<DTDL.Property>('Property');
is.Telemetry = is<DTDL.Telemetry>('Telemetry');
is.Component = is<DTDL.Component>('Component');

// Helper to convert from a capability stack to a name path
export function stackToPath(stack: (DTDL.Capability | undefined)[]) {
    return (stack.filter(i => i) as DTDL.Capability[])
        .reverse()
        .map(({ name }) => name);
}

// Get a property value from an object according to its capability stack
export function getProperty(
    container: any,
    property: DTDL.Property,
    ...stack: (DTDL.Component | undefined)[]
) {
    let target = container;
    for (const key of stackToPath(stack)) {
        target = target[key] || {};
    }
    return target[property.name];
}

// Set a property value in an object according to its capability stack
export function setProperty(
    container: any,
    value: any,
    property: DTDL.Property,
    ...stack: (DTDL.Component | undefined)[]
) {
    let target = container;
    for (const key of stackToPath(stack)) {
        target = target[key] = target[key] || {};
    }
    target[property.name] = value;
    return container;
}

// Helper to ensure a value is in array format
export function toArray<T>(value?: T | T[]) {
    return Array.isArray(value) ? value : value !== undefined ? [value] : [];
}
