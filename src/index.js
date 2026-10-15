import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { register as registerServiceWorker } from "./serviceWorkerRegistration";
import { Account } from "./contexts/Auth/Account";
import Offline from "./components/Offline";
import "bootstrap/dist/css/bootstrap.min.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Offline>
    <Account>
      <App />
    </Account>
  </Offline>
);

registerServiceWorker();
