import React, {useContext, useEffect, useState} from "react";

import {Cookies} from "react-cookie";
import {useLocation, useNavigate} from "react-router-dom";

import {AuthContext} from "@/context";
import axios from "axios";
import {useConnectWallet} from "@web3-onboard/react";

export const useAuth = () => {
    let navigate = useNavigate();
    const { search, pathname } = useLocation();

    const user = JSON.parse(sessionStorage.getItem('user'))
    let initState = {signedIn: false, user: null}
    if(user) {
        initState = {signedIn: true, user}
    }
    if(new URLSearchParams(search).get('status') === 'true'){
        initState = {signedIn: true, user: new URLSearchParams(search).get('user')}
        sessionStorage.setItem('user',JSON.stringify(new URLSearchParams(search).get('user')))
    }
    const [userData, setUserdata] = useState(initState);
    const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
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
        disconnectWallet()
    }

    async function disconnectWallet() {
        if(wallet) await disconnect(wallet)
    }

    function loginFromToken(){
        const query = new URLSearchParams(search)
        setAsLogged(query.get('user'));
    }

    function loginUserOnStartup()
    {
        let token = null;
        if(new URLSearchParams(search).get('token')){
            loginFromToken()
            token = new URLSearchParams(search).get('token')
        }
        const cookie = new Cookies();
        if(cookie.get('is_auth') || token) {
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
        disconnectWallet,
        setAsLogged,
        setLogout,
        loginUserOnStartup,
        updateLoggedUser
    }

};
