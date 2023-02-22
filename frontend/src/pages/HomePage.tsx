import {Button} from "react-bootstrap";
import {useMsal, AuthenticatedTemplate, UnauthenticatedTemplate} from "@azure/msal-react";
import {loginHandle, logoutHandle} from "../utils/authConfig";
import {authHost} from "../http";

const HomePage = () => {

    return (
        <>
            <h1>This is home page</h1>
            <div className="d-flex flex-column justify-content-center">
                <h2>Get out of here</h2>
                <UnauthenticatedTemplate>
                    <Button variant="primary"
                            onClick={() => loginHandle()}>Sign
                        in</Button>
                </UnauthenticatedTemplate>
                <AuthenticatedTemplate>
                    <Button variant="primary"
                            onClick={() => logoutHandle()}>Sign out</Button>
                </AuthenticatedTemplate>
            </div>
            <AuthenticatedTemplate>
                <Button variant="secondary"
                        onClick={async () => await authHost.get('/api/users')}>Api call</Button>
            </AuthenticatedTemplate>
        </>
    )
}

export default HomePage;