import { HOME_ROUTE } from './routesNames';

import {
    HomePage
} from '../pages'
import {MainLayout} from '../components/layout';
import {NonIndexRouteObject} from "react-router-dom";
import AuthWrapper from "../components/auth/AuthWrapper";
import {ItemManagerDemo} from "../ItemManagerDemo";
import {PeopleManagerDemo} from "../PeopleManagerDemo";
import {PersonProfile} from "../components/PersonProfile/PersonProfile";

export const routes: NonIndexRouteObject[] = [
    {
        path: HOME_ROUTE,
        element:
            <AuthWrapper>
                <MainLayout/>
            </AuthWrapper>,
        children: [
            {
                path: "",
                element: <HomePage/>
            },
            {
                path: "/items",
                element: <ItemManagerDemo/>
            },
            {
                path: '/people/:personId',
                element: <PersonProfile/>
            },
            {
                path: "/people",
                element: <PeopleManagerDemo/>
            }
        ]
    }
]
