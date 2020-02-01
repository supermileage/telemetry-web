import datasets from "./datasets.js";

let config = {
  datastore: {
    // https://cloud.google.com/datastore/docs/reference/data/rest/v1/projects/runQuery
    projectId: "supermileage-telemetry-266511",
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
      "929098184548-qq0n3oj40b7s2qbk8nmjm9cn5c6bs15l.apps.googleusercontent.com"
  },
  map: {
    defaults: {
      // Vancouver
      center: { lat: 49.267941, lng: -123.24736 },
      zoom: 12
    }
  },
  refreshInterval: 5000
};

export default config;