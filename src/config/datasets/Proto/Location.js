import React from "react";
import MapContainer from "../../../components/MapContainer.js";

const Location = {
  label: "Location",
  id: "PROTO-Location",
  handler: function(retval, d) {
    let NMEASeq = d.entity.properties.data.stringValue.split(",");
    let lat =
      parseInt(parseInt(NMEASeq[3]) / 100) +
      parseFloat(parseFloat(NMEASeq[3]) % 100) / 60;
    let lng =
      parseInt(parseInt(NMEASeq[5]) / 100) +
      parseFloat(parseFloat(NMEASeq[5]) % 100) / 60;
    lat = NMEASeq[4] === "S" ? -lat : lat;
    lng = NMEASeq[6] === "W" ? -lng : lng;
    let timestamp = d.entity.properties.recorded_at.stringValue;
    let elem = { lat, lng, timestamp };
    retval.push(elem);
  },
  parser: function(data) {
    return data;
  },
  element: function(data) {
    return <MapContainer key={this.id} data={data || []} />;
  }
};

export default Location;
