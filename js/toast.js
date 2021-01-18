let isToast = false;
let toastTimer = null;
const toastDom = e("#toast");

const Toast = {
  show: (msg) => {
    toastDom.innerText = msg;
    if (isToast) {
      clearTimeout(toastTimer);
    } else {
      toastDom.classList.remove("hide");
      isToast = true;
    }
    toastTimer = setTimeout(() => {
      toastDom.classList.add("hide");
      isToast = false;
    }, 3000);
  },
  hide: () => {
    toastDom.classList.add("hide");
    isToast = false;
  },
};
