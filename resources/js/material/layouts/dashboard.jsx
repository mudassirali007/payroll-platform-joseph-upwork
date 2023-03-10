import {Routes, Route, useNavigate, Navigate} from "react-router-dom";

import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import {useMaterialTailwindController, setOpenConfigurator, setEmployees} from "@/context";
import React, {useContext, useEffect} from "react";
import {AuthContext} from "@/context";
import axios from "axios";

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
    const {authData} = useContext(AuthContext);
    const navigate = useNavigate();
    const fetchData = () => {
        axios.get('/api/employee').then(response => {
            if(response.status === 200) setEmployees(dispatch, response.data || []);
        }).catch(error => {
            console.error(error);
        });
    }
    useEffect(() => {
        if(!authData.signedIn) {
            navigate('/login');
        } else {
            fetchData()
        }
    }, []);
  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={routes}
        brandImg={
          sidenavType === "dark" ? "/img/24042614.jpg" : "/img/24042614.jpg"
        }
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        <Configurator />
        {/*<IconButton*/}
        {/*  size="lg"*/}
        {/*  color="white"*/}
        {/*  className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"*/}
        {/*  ripple={false}*/}
        {/*  onClick={() => setOpenConfigurator(dispatch, true)}*/}
        {/*>*/}
        {/*  <Cog6ToothIcon className="h-5 w-5" />*/}
        {/*</IconButton>*/}
        <Routes>
          {routes.map(
            ({ layout, pages }) =>
              layout === "dashboard" &&
              pages.map(({ path, element }) => (
                <Route exact path={path} element={element} />
              ))
          )}
            {/*<Route path="*" element={<Navigate to="/auth/sign-in" replace />} />*/}
        </Routes>
        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
