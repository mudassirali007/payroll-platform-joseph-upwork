import React, {useContext, useEffect, useState} from "react";

import {Cookies} from "react-cookie";
import {useNavigate} from "react-router-dom";

import {AuthContext} from "@/context";
import axios from "axios";

export const useAuth = () => {
    let navigate = useNavigate();

    const user = JSON.parse(sessionStorage.getItem('user'))
    let initState = {signedIn: false, user: null}
    if(user) {
        initState = {signedIn: true, user}
    }
    const [userData, setUserdata] = useState(initState);

    const {setAuthData} = useContext(AuthContext);

    useEffect(() => {
        console.log('setAuthData called')
        setAuthData(userData);
    }, [userData]);

    function getAuthCookieExpiration()
    {
        let date = new Date();
        date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));  // 7 days
        return date;
    }

    function setAsLogged(user) {

        const cookie = new Cookies();

        cookie.set('is_auth', true, {path: '/', expires: getAuthCookieExpiration(), sameSite: 'lax', httpOnly: false});

        setUserdata({signedIn: true, user});
        sessionStorage.setItem('user',JSON.stringify(user))

        navigate('/dashboard/home');
    }

    function updateLoggedUser(user) {

        setUserdata({signedIn: true, user});
        sessionStorage.setItem('user',JSON.stringify(user))
    }

    function setLogout() {
        const cookie = new Cookies();

        cookie.remove('is_auth', {path: '/', expires: getAuthCookieExpiration(), sameSite: 'lax', httpOnly: false});

        setUserdata({signedIn: false, user: null});
        sessionStorage.removeItem('user')
        navigate('/auth/sign-in');
    }

    function loginUserOnStartup()
    {
        const cookie = new Cookies();
        if(cookie.get('is_auth')) {
            axios.post('/api/me').then(response => {
                setAsLogged(response.data.user)
                // setUserdata({signedIn: true, user: response.data.user});
                // navigate('/dashboard/home');
            }).catch(error => {
                // setUserdata({signedIn: false, user: null});
                setLogout();
            });

        } else {
            setLogout();
            // setUserdata({signedIn: false, user: null});
            // navigate('/auth/sign-in');
        }
    }

    return {
        userData,
        setAsLogged,
        setLogout,
        loginUserOnStartup,
        updateLoggedUser
    }

};
