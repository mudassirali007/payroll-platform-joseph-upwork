import React, {useContext, useEffect} from "react";
import {useNavigate} from "react-router-dom";

import AuthContext from "../../context/authContext";

export const Home = () => {

    const {authData} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Home called')
        if(!authData.signedIn) {
            navigate('/login');
        }
    }, []);

    return (
        <div className="row justify-content-center">
            <div className="col-md-8">
                <div className="card">
                    <div className="card-header">Payroll Inc</div>

                    <div className="card-body">
                        {
                            authData.signedIn && authData.user && (
                                <>
                                    <p>Signed in</p>
                                    <div>Hi {authData.user.name}</div>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};
