import {PublicClientApplication} from "@azure/msal-browser";
import {customSessionStorage} from "./storage";

export const msalConfig = {
    auth: {
        clientId: process.env.REACT_APP_CLIENT_ID as string,
        authority: process.env.REACT_APP_CLOUD_INSTANCE as string + process.env.REACT_APP_TENANT_ID as string,
        redirectUri: window.location.origin
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false
    }
};

export const loginRequest = {
    scopes: ["User.Read"]
}

export const logoutRequest = {}

export const msalInstance = new PublicClientApplication(msalConfig);

export const loginHandle = (instance = msalInstance) => {
    instance.loginRedirect(loginRequest).catch(e => console.error(e));
};

export const logoutHandle = (instance = msalInstance) => {
    //Remove saved access token
    customSessionStorage.resetAuthToken();

    const currentAccount = msalInstance.getAllAccounts()[0];
    console.log(msalInstance);
    console.log(currentAccount);
    instance.logoutRedirect({
        account: currentAccount,
        postLogoutRedirectUri: window.location.origin
    }).catch(e => console.error(e))
};

export const requestAccessToken = async (instance = msalInstance) => {
    const accounts = msalInstance.getAllAccounts();

    const request = {
        scopes:[process.env.REACT_APP_ACCESS_TOKEN_API as string],
        account: accounts[0]
    };
    return (await instance.acquireTokenSilent(request)).accessToken;
};

export const getAccessToken = async () => {
    let token = customSessionStorage.getAuthToken();
    if(token === null){
        token = await requestAccessToken();
        customSessionStorage.setAuthToken(token);
    }
    return token;
};