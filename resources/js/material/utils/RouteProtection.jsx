import {Navigate, Outlet} from "react-router-dom";

const ProtectedRoute = ({
                            signedIn,
                            redirectPath = '/auth/sign-in'
                        }) => {
    if (!signedIn) {
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
