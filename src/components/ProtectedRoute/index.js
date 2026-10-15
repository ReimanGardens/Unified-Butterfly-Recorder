import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { TopNavbar, BottomNavBar } from "components/Navbar";
import { UserPreferences } from "../../contexts/UserPreferences/UserPreferences";
import { Survey } from "../../contexts/surveyContext/surveyContext";
import { Lists } from "../../contexts/listContext";

const ProtectedRoute = ({ auth, toggle }) => {
  return auth ? (
    // User is Authorized by AWS, go here
    <>
      <UserPreferences>
        <Survey>
          <Lists>
            <TopNavbar toggle={toggle} auth={auth} />
            <Outlet />
            <BottomNavBar toggle={toggle} auth={auth} />
          </Lists>
        </Survey>
      </UserPreferences>
    </>
  ) : (
    // User is NOT authorized, go here
    <Navigate to="/" replace={true} />
  );
};

export default ProtectedRoute;
