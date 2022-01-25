import {Navigate, Outlet} from "react-router-dom";

function SafeRouting({Authenticated}){
    if (Authenticated) {
        return <Outlet/>
    }
    return <Navigate to={"/"} />

}

export default SafeRouting;