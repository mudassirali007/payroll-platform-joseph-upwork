import {Navigate, Outlet} from "react-router-dom";

const ProtectedRoute = ({
                            signedIn,
                            redirectPath = '/login',
                            children,
                        }) => {
    console.log('ProtectedRoute->', signedIn)
    if (!signedIn) {
        return <Navigate to={redirectPath} replace />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;
