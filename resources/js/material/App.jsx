import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";

import {AuthContext} from "@/context";
import React, {useState} from "react";
import {useAuth} from "@/hooks/useAuth";
import RouteProtection from "@/utils/RouteProtection";


function App() {
    const {userData} = useAuth();

    const [authData, setAuthData] = useState({signedIn: userData.signedIn, user: userData.user});

    return (
        <AuthContext.Provider value={{authData, setAuthData }}>
            <Routes>
                <Route element={<RouteProtection signedIn={authData.signedIn} />}>
                    <Route path="/dashboard/*" element={<Dashboard /> } />
                </Route>

                <Route path="/auth/*" element={<Auth />} />
                <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
            </Routes>
        </AuthContext.Provider>
  );
}

export default App;
