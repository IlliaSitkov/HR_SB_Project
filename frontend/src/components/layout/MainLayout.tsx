import {Outlet} from "react-router-dom";
import {HorizontalCenterLayout} from "./index";

const MainLayout = () =>{
    return (
        <HorizontalCenterLayout>
            <Outlet/>
        </HorizontalCenterLayout>
    )
}
export default MainLayout;
