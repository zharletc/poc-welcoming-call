export default function ({ store, $axios }) {
  // const agent = new https.Agent({
  //   rejectUnauthorized: false,
  // });
  $axios.onError((error) => {
    console.log("INI ERROR ", error);
    store.dispatch("toggleOverlayLoading", { show: false }, { root: true });
    let message = "Terjadi kesalahan, coba lagi.";
    if (typeof error.response.data.message != "undefined") {
      message = error.response.data.message;
    } else if (typeof error.response.data.Message != "undefined") {
      message = error.response.data.Message;
    } else {
      message = "Terjadi kesalahan, coba lagi.";
    }

    console.log("INI ERROR ", error, message);
    store.dispatch(
      "showResponseAlert",
      {
        message: message,
        type: "error",
        status_code: error.response.status,
      },
      { root: true }
    );

    // Handle if response unauthorized 401
    if (error.response.status == 401) {
      store.dispatch("auth/clearAuth");
    }
    // window.$nuxt.$store.getters.myVar => can use this for another js without closure
    return Promise.reject(error.response);
  });
}
