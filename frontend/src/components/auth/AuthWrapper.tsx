import {FC, ReactElement} from "react";
import {MsalProvider} from "@azure/msal-react";
import {msalInstance} from "../../utils/authConfig";

const AuthWrapper: FC<{ children?: ReactElement }> = ({children}) => {
    return (
        <MsalProvider instance={msalInstance}>
            {children}
        </MsalProvider>
    );
}

export default AuthWrapper;