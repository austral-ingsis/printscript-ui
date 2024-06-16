import { createAuth0Client, Auth0Client } from '@auth0/auth0-spa-js';

const _initOptions = {
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID
}

let _client: Auth0Client | undefined;

const getAuth0Client = (): Promise<Auth0Client> => {
    return new Promise<Auth0Client>((resolve, reject) => {
        if (!_client) {
            createAuth0Client(_initOptions)
                .then(client => {
                    _client = client;
                    resolve(client);
                })
                .catch(e => {
                    reject(new Error(`getAuth0Client Error: ${e.message}`));
                });
        } else {
            resolve(_client);
        }
    });
};

export const getAccessToken = async (...p: Parameters<Auth0Client['getTokenSilently']>): Promise<string> => {
    if (!_client) {
        _client = await getAuth0Client();
    }
    return await _client.getTokenSilently(...p);
};
