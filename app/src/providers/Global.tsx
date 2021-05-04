import React from 'react';

import Storage from './Storage';

export default class Global {
    application?: string;

    static create(states: any): Global {
        // Proxy definition for merging state entries into a single object
        return new Proxy(states, {
            get(tgt, key) {
                return tgt[key]?.[0];
            },
            set(tgt, key, val) {
                if (tgt[key]) {
                    tgt[key][1](val);
                }
                return !!tgt[key];
            },
        });
    }

    static Context: React.Context<Global>;
    static Provider: React.FunctionComponent;
}

Global.Context = React.createContext(Global.create({}));

Global.Provider = ({ children }: React.PropsWithChildren<{}>) => {
    const storage = React.useContext(Storage.Context);
    const value = Global.create({
        application: storage.useState('application', '', String),
    });
    return (
        <Global.Context.Provider value={value}>
            {children}
        </Global.Context.Provider>
    );
};
