import {Button} from "react-bootstrap";
import {useMsal, AuthenticatedTemplate, UnauthenticatedTemplate} from "@azure/msal-react";
import {loginHandle, logoutHandle} from "../utils/authConfig";

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
                <h2>Logged in</h2>
            </AuthenticatedTemplate>
        </>
    )
}

export default HomePage;