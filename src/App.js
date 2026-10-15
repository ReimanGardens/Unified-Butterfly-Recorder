import React, { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AccountContext } from "./contexts/Auth/Account";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginRegisterPage from "pages/loginRegisterPage";
import Home from "./pages/home";
import SurveyPage from "./pages/surveyPage";
import SurveyDetailsPage from "./pages/surveyDetailsPage";
import UserProfile from "./pages/userProfilePage";
import EditUserProfile from "./pages/editUserProfile";
import Help from "./pages/helpPage";
import LoadedListsPage from "./pages/loadedListsPage";
import ForgotPassword from "pages/forgotPassword";
import CreateSurveyPage from "./pages/createSurveyPage";
import ActiveSurveyButterflies from "./pages/activeSurveyButterflies";
import SightingDetails from "./pages/sightingDetails";
import Sightings from "./pages/Sightings";
import Settings from "./pages/settings";

function App() {
  /* State retrieved form the AccountContext to represent whether the user is authorized or not */
  const { userAuthorized } = useContext(AccountContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginRegisterPage />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route element={<ProtectedRoute auth={userAuthorized} />} path="/auth">
          <Route element={<Home />} path="home" />
          <Route element={<SurveyPage />} path="dashboard" />
          <Route element={<SurveyDetailsPage />} path="surveyDetails" />
          <Route element={<UserProfile />} path="profile" />
          <Route element={<EditUserProfile />} path="profile/edit" />
          <Route element={<Help />} path="help" />
          <Route element={<CreateSurveyPage />} path="createSurvey" />
          <Route
            element={<ActiveSurveyButterflies />}
            path="activeSurveyButterflies"
          />
          <Route element={<Sightings />} path="Sightings" />
          <Route element={<SightingDetails />} path="sightings-detail" />
          <Route element={<Settings />} path="settings" />
          <Route element={<LoadedListsPage />} path="loadedlists" />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
