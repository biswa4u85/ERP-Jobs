import React from "react";
import { NavLink } from "react-router-dom";

function Headers() {
    return (
        <>
            <header className="sticky-header">
                <div className="container">
                    <div className="sixteen columns">
                        <div id="logo">
                            <h1><NavLink to="/"><img src={`http://hr.hellorecruit.io/files/Purple_PNG.png`} alt="Hellorecruit" /></NavLink></h1>
                        </div>
                        {/* <nav id="navigation" className="menu">
                            <ul className="float-right">
                                <li><a href="/app"><i className="fa fa-dashboard"></i> Dashboard</a></li>
                            </ul>
                        </nav> */}
                    </div>
                </div>
            </header>
            <div className="clearfix"></div>
        </>);
}

export default Headers;