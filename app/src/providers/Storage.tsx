import React from 'react';
import { useAsync } from 'react-async-hook';
import * as SecureStore from 'expo-secure-store';

export default class Storage {
    constructor(
        public readonly get?: (key: string) => Promise<string | null>,
        public readonly set?: (key: string, val: string) => Promise<void>,
        public readonly del?: (key: string) => Promise<void>
    ) {}

    // Hook to create a state stored to and restored from storage
    useState<T>(
        key: string,
        initial: T,
        parse: (str: string) => T,
        stringify: (val: T) => string = String
    ) {
        const [value, setValue] = React.useState(initial);

        React.useEffect(() => {
            if (this.get) {
                this.get(key).then(str => str != null && setValue(parse(str)));
            }
        }, [this.get]);

        React.useEffect(() => {
            if (this.set) {
                this.set(key, stringify(value));
            }
        }, [this.set, value]);

        return [value, setValue];
    }

    static Context: React.Context<Storage>;
    static Provider: React.FunctionComponent;
}

Storage.Context = React.createContext(new Storage());

Storage.Provider = ({ children }: React.PropsWithChildren<{}>) => {
    // Determine which storage mechanism to use
    const { result } = useAsync(SecureStore.isAvailableAsync, []);

    // Return a storage helper using the appropriate mechanism
    const value = React.useMemo(() => {
        switch (result) {
            case true:
                return new Storage(
                    SecureStore.getItemAsync,
                    SecureStore.setItemAsync,
                    SecureStore.deleteItemAsync
                );
            case false:
                return new Storage(
                    async k => localStorage.getItem(k),
                    async (k, v) => localStorage.setItem(k, v),
                    async k => localStorage.removeItem(k)
                );
            default:
                return new Storage();
        }
    }, [result]);

    return (
        <Storage.Context.Provider value={value}>
            {children}
        </Storage.Context.Provider>
    );
};
