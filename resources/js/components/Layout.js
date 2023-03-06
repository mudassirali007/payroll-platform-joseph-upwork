import React, {useEffect} from "react";

import {useAuth} from "../hooks/useAuth";
import Navbar from "./Navbar";


export const Layout = ({ children }) => {

    const { loginUserOnStartup } = useAuth();

    // useEffect(() => {
    //     loginUserOnStartup();
    // }, []);

    return (
        <div>
            <Navbar />
            <div className="container">
                { children }
            </div>
        </div>
    );
};
