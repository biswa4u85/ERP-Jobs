import React from "react";
import { Outlet } from "react-router-dom";
import Headers from "./Headers";
import Footers from "./Footers";

function Layouts() {
    return (
        <div id="wrapper">
            <Headers />
            <Outlet />
            <Footers />
        </div>
    );
}

export default Layouts;