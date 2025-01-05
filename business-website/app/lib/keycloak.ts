// lib/keycloak.js
import Keycloak from "keycloak-js";

const initOptions = {
  url: "http://localhost:8080/",
  realm: "employees",
  clientId: "business-website",
};

const kc = new Keycloak(initOptions);

export const initializeKeycloak = () =>
  kc.init({ onLoad: "check-sso" }).then((authenticated) => {
    console.log("Keycloak initialized:", authenticated);
  });

export default kc;
