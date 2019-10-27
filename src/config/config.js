import datasets from "./datasets.js";

let config = {
  datastore: {
    // https://cloud.google.com/datastore/docs/reference/data/rest/v1/projects/runQuery
    projectId: "telemetry-urban-sm",
    getQueryUrl: function() {
      return (
        "https://datastore.googleapis.com/v1/projects/" +
        this.projectId +
        ":runQuery?alt=json"
      );
    },
    generatePayload: (token, body) => {
      return {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: body
      };
    },
    datasets: datasets
  },
  oauth: {
    clientId:
      "361835365952-be92snngmdj4q3p52bs05u31qd8vq4gb.apps.googleusercontent.com"
  },
  map: {
    // Non-secret, so we can commit this
    apiKey: "AIzaSyC5l2tTNWl1b3vliRAbpWD_r3jZXrV85kA",
    getSrcUrl: function() {
      return (
        "https://maps.googleapis.com/maps/api/js?key=" +
        this.apiKey +
        "&callback=initMap"
      );
    },
    defaults: {
      // Vancouver
      center: { lat: 49.267941, lng: -123.24736 },
      zoom: 12
    }
  }
};

export default config;