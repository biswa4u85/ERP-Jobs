import React, { useEffect } from "react";
import {
  BrowserRouter,
  HashRouter,
  Routes,
  Route,
} from "react-router-dom";
import Layouts from "../pages/Layouts";
import Home from "../pages/Home";
import Listing from "../pages/Listing";
import Details from "../pages/Details";

function Routers() {
  
  useEffect(() => {
    // if (window?.frappe?.csrf_token == 'None') {
    //   window.location.replace(`${window.location.origin}/login`)
    // }
  }, [])

  return (
    <HashRouter>
      <Routes>
        <Route element={<Layouts />}>
          <Route path="/" element={<Home />} />
          <Route path="/listing" element={<Listing />} />
          <Route path="/details/:id" element={<Details />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default Routers