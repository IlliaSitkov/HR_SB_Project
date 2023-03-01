import {Button} from "react-bootstrap";
import {AuthenticatedTemplate, UnauthenticatedTemplate, useIsAuthenticated} from "@azure/msal-react";

import {isAuthenticated, loginHandle, logoutHandle} from "../utils/authConfig";
import {authHost} from "../http";
import {useEffect, useState} from "react";
import NearestBirthdays from "../components/NearestBirthdays/NearestBirthdays";
import {PersonBirthday} from "../models/person";
import {getNearestBirthdays} from "../http/person";

const HomePage = () => {
    const [generations, setGenerations] = useState('');
    const [birthdays, setBirthdays] = useState<PersonBirthday[]>([]);

    useEffect(() => {
        async function getBirthdays() {
            const birthdays: PersonBirthday[] = await getNearestBirthdays();
            return birthdays;
        }

        getBirthdays().then(setBirthdays);
    }, []);

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
                        onClick={async () => {
                            const s: object = (await authHost.get('/api/generations')).data;
                            console.log(s);
                            setGenerations(JSON.stringify(s))
                        }}>Api call</Button>
                {generations}
            </AuthenticatedTemplate>
            <AuthenticatedTemplate>
                <div className="w-50">
                    <NearestBirthdays birthdays={birthdays}/>
                </div>
            </AuthenticatedTemplate>
        </>
    )
}

export default HomePage;