import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "@/hooks/useAuth";

const ProtectedRoute = ({
                            signedIn,
                            redirectPath = '/auth/sign-in'
                        }) => {
    const {disconnectWallet} = useAuth();
    if (!signedIn) {
        disconnectWallet()
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
