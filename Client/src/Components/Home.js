import React, {Fragment, useCallback, useState} from "react";
import '../style.css';
import SignUp from "./SignUp";
import Login from "./Login";
const Home = ({setAuth}) => {

    return (
        <div className="body">
        <div className="main">
            <input type="checkbox" id="chk" aria-hidden="true" />
            <SignUp setAuth={setAuth} />
            <Login setAuth={setAuth} />
        </div>
        </div>

    );
};
export default Home;