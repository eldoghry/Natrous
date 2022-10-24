/* eslint-disable */

const loginForm = document.forms["loginForm"];
const logoutBtn = document.getElementById("logout");

async function handleLogin(e) {
  e.preventDefault();
  try {
    const email = this.elements.email.value;
    const password = this.elements.password.value;

    const res = await axios.post("http://localhost:3000/api/v1/users/login", {
      email,
      password,
    });

    if (res.data.status === "success") {
      showAlert("success", "Login Successfuly");
      window.setTimeout(() => window.location.assign("/"), 1500);
    }
  } catch (error) {
    showAlert("error", error.response.data.message);
  }
}

const handleLogout = async () => {
  try {
    console.log("logout");

    const res = await axios.get("http://localhost:3000/logout");

    if (res.data.status === "success") window.location.reload(true); // hard reload
  } catch (error) {
    console.log(error);
    showAlert("error", error.response.data.message);
  }
};

loginForm && loginForm.addEventListener("submit", handleLogin.bind(loginForm));

logoutBtn && logoutBtn.addEventListener("click", handleLogout);
