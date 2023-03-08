import { HOME_ROUTE } from './routesNames';

import {
    HomePage
} from '../pages'
import {MainLayout} from '../components/layout';
import {NonIndexRouteObject} from "react-router-dom";
import AuthWrapper from "../components/auth/AuthWrapper";
import {ItemManagerDemo} from "../ItemManagerDemo";
import {PeopleList} from "../components/PeopleList/PeopleList";
import {useState} from "react";

// 0 - not yet loaded
// 1 - started loading
// 2 - error while loading
// 3 - loaded successfully
const [gotData, setGotData] = useState(0);

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
                path: "/people",
                element: <PeopleList gotData={gotData} setGotData={setGotData}/>
            }
        ]
    }
]
