/* eslint-disable */
// import "@babel/polyfill";
import { handleLogin, handleLogout } from "./login.js";
import { displayMap } from "./mapbox.js";

// DOM ELEMENET
const loginForm = document.forms["loginForm"];
const logoutBtn = document.getElementById("logout");
const mapbox = document.getElementById("map");

loginForm && loginForm.addEventListener("submit", handleLogin.bind(loginForm));
logoutBtn && logoutBtn.addEventListener("click", handleLogout);

if (mapbox) {
  const locations = JSON.parse(mapbox.dataset.locations);
  displayMap(locations);
}
