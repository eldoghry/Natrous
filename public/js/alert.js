/* eslint-disable */

//type: success| error
export const showAlert = (type, msg) => {
  //hide old alerts
  hideAlert();

  // 1) create alert elemement
  const el = `<div class="alert alert--${type}">${msg}</div>`;

  //2) add el to body
  document.getElementsByTagName("body")[0].insertAdjacentHTML("afterbegin", el);

  window.setTimeout(() => {
    hideAlert();
  }, 1500);
};

export const hideAlert = () => {
  const el = document.querySelector(".alert");
  el && el.parentNode.removeChild(el);
};
