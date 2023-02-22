import {
    HOME_ROUTE
} from './routesNames';

import {
    HomePage
} from '../pages'
import {MainLayout} from '../components/layout';
import {NonIndexRouteObject} from "react-router-dom";

export const routes:NonIndexRouteObject[] = [
    {
        path: HOME_ROUTE,
        element: <MainLayout/>,
        children: [
            {
                path: "",
                element: <HomePage/>
            }
        ]
    }
]