import { StackScreenProps } from '@react-navigation/stack';

import { Api, Collection } from '../providers';

export interface Definition<L, G, C> {
    list: List<L>;
    get: Get<G>;
    create: Create<C>;
    remove: Remove;
}

export interface List<T> {
    name: string;
    title: string;
    execute: (api: Api) => Collection<T>;
    item: (data: T) => { icon: string; id: string; displayName?: string };
}

export interface Get<T> {
    name: string;
    title: string;
    execute: (api: Api, id: string) => Promise<T>;
    form: (
        api: Api,
        data: T,
        setDisplayName: (displayName?: string) => unknown
    ) => Promise<JSX.Element | null>;
}

export interface Create<T> {
    name: string;
    title: string;
    execute: (api: Api, data: T) => Promise<string>;
    form: (
        api: Api,
        setData: (data: T) => unknown,
        setDisplayName: (displayName?: string) => unknown
    ) => Promise<JSX.Element | null>;
}

export interface Remove {
    name: string;
    title: string;
    execute: (api: Api, id: string) => Promise<void>;
}

export type Factory = <L, G, C>(
    definition: Definition<L, G, C>
) => React.VoidFunctionComponent<
    StackScreenProps<Record<string, Record<string, any>>>
>;
