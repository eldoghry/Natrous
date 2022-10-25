const $fc9f18cd978afa5b$export$de026b00723010c1 = (type, msg)=>{
    //hide old alerts
    $fc9f18cd978afa5b$export$516836c6a9dfc573();
    // 1) create alert elemement
    const el = `<div class="alert alert--${type}">${msg}</div>`;
    //2) add el to body
    document.getElementsByTagName("body")[0].insertAdjacentHTML("afterbegin", el);
    window.setTimeout(()=>{
        $fc9f18cd978afa5b$export$516836c6a9dfc573();
    }, 1500);
};
const $fc9f18cd978afa5b$export$516836c6a9dfc573 = ()=>{
    const el = document.querySelector(".alert");
    el && el.parentNode.removeChild(el);
};


const $e33d9ff231aec008$export$da4fc2bf424da4ca = async function(e) {
    e.preventDefault();
    try {
        const email = this.elements.email.value;
        const password = this.elements.password.value;
        const res = await axios.post("http://localhost:3000/api/v1/users/login", {
            email: email,
            password: password
        });
        if (res.data.status === "success") {
            (0, $fc9f18cd978afa5b$export$de026b00723010c1)("success", "Login Successfuly");
            window.setTimeout(()=>window.location.assign("/"), 1500);
        }
    } catch (error) {
        (0, $fc9f18cd978afa5b$export$de026b00723010c1)("error", error.response.data.message);
    }
};
const $e33d9ff231aec008$export$297d1113e3afbc21 = async ()=>{
    try {
        const res = await axios.get("http://localhost:3000/logout");
        if (res.data.status === "success") window.location.reload(true); // hard reload
    } catch (error) {
        console.log(error);
        (0, $fc9f18cd978afa5b$export$de026b00723010c1)("error", error.response.data.message);
    }
};


console.log("hello");
const $1cd085a7ac742057$var$loginForm = document.forms["loginForm"];
const $1cd085a7ac742057$var$logoutBtn = document.getElementById("logout");
$1cd085a7ac742057$var$loginForm && $1cd085a7ac742057$var$loginForm.addEventListener("submit", (0, $e33d9ff231aec008$export$da4fc2bf424da4ca).bind($1cd085a7ac742057$var$loginForm));
$1cd085a7ac742057$var$logoutBtn && $1cd085a7ac742057$var$logoutBtn.addEventListener("click", (0, $e33d9ff231aec008$export$297d1113e3afbc21));


//# sourceMappingURL=bundle.js.map
