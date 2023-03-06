import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {Layout} from "./Layout";
import {Home} from "./pages/Home";
import {Login} from "./pages/Login";
import {Register} from "./pages/Register";

import {useAuth} from "../hooks/useAuth";
import AuthContext from "../context/authContext";
import RouteProtection from "../utils/RouteProtection";

function RootApp() {

    const {userData} = useAuth();
    const [authData, setAuthData] = useState({signedIn: userData.signedIn, user: userData.user});

    console.log('in root', authData)
    return (
        <AuthContext.Provider value={{authData, setAuthData }}>
            <Layout>
                <Routes>
                    <Route element={<RouteProtection signedIn={authData.signedIn} />}>
                        <Route path="/dashboard" element={<Home /> } />
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Route>
                    <Route path="/login" element={<Login /> } />
                    <Route path="/register" element={<Register /> } />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Layout>
        </AuthContext.Provider>
    );
}
export default RootApp;
if (document.getElementById('app')) {

    createRoot(document.getElementById('app')).render(<BrowserRouter>
        <RootApp />
    </BrowserRouter>)
    // ReactDOM.render(
    //     <BrowserRouter>
    //         <RootApp />
    //     </BrowserRouter>
    //     , document.getElementById('app'));
}
