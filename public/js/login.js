const loginForm = document.forms.loginForm;

const handleLogin = async function (e) {
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
    console.log(error);
  }
};

loginForm.addEventListener("submit", handleLogin.bind(loginForm));
