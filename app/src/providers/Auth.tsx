import React from 'react';
import {
    DiscoveryDocument,
    exchangeCodeAsync,
    makeRedirectUri,
    TokenResponse,
    useAuthRequest,
    useAutoDiscovery,
} from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

// Replace with the client and tenant IDs from your AAD application
export const CLIENT_ID = '<AAD application client ID>';
export const TENANT_ID = '<AAD application tenant ID>';

const CONFIG = {
    clientId: CLIENT_ID,
    scopes: ['https://apps.azureiotcentral.com/user_impersonation'],
    redirectUri: makeRedirectUri(),
};
const ISSUER = `https://login.microsoftonline.com/${TENANT_ID}/v2.0`;

export default class Auth {
    async accessToken() {
        if (this.token.shouldRefresh()) {
            this.token = await this.token.refreshAsync(CONFIG, this.discovery);
        }
        return this.token.accessToken;
    }

    constructor(
        private token: TokenResponse,
        private discovery: DiscoveryDocument
    ) {}

    static Context: React.Context<Auth | undefined>;
    static Provider: React.FunctionComponent;
}

WebBrowser.maybeCompleteAuthSession();

Auth.Context = React.createContext<Auth | undefined>(undefined);

Auth.Provider = ({ children }: React.PropsWithChildren<{}>) => {
    const [token, setToken] = React.useState<TokenResponse>();
    const discovery = useAutoDiscovery(ISSUER);
    const [req, res, prompt] = useAuthRequest(CONFIG, discovery);

    // Since everything in the app requires auth, prompt immediately
    React.useEffect(() => {
        if (req) {
            prompt();
        }
    }, [req]);

    // Once the auth code is available, exchange it for a token
    React.useEffect(() => {
        if (res?.type === 'success') {
            const extraParams = { code_verifier: req!.codeVerifier! };
            const config = { ...CONFIG, code: res.params.code, extraParams };
            exchangeCodeAsync(config, discovery!).then(setToken);
        }
    }, [res]);

    // Once the token is available, provide the auth accessor
    const value = React.useMemo(() => token && new Auth(token, discovery!), [
        token,
    ]);
    return (
        <Auth.Context.Provider value={value}>{children}</Auth.Context.Provider>
    );
};
