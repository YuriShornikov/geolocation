function geolocation(successCallback, errorCallback) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (data) {
        const { latitude, longitude } = data.coords;
        successCallback({ latitude, longitude });
      },
      function (err) {
        errorCallback();
        console.log(err);
      },
      { enableHighAccuracy: true },
    );
  } else {
    errorCallback();
  }
}

export { geolocation };
