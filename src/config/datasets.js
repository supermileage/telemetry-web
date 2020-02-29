import UrbanTemperature from "./datasets/Urban/Temperature.js";
import UrbanPower from "./datasets/Urban/Power.js";
import UrbanLocation from "./datasets/Urban/Location.js";

import ProtoSpeed from "./datasets/Proto/Speed.js";
import ProtoLocation from "./datasets/Proto/Location.js";
import ProtoECT from "./datasets/Proto/ECT.js";
import ProtoIAT from "./datasets/Proto/IAT.js";
import ProtoRPM from "./datasets/Proto/RPM.js";
import ProtoUBADC from "./datasets/Proto/UBADC.js";
import ProtoO2S from "./datasets/Proto/O2S.js";
import ProtoSPARK from "./datasets/Proto/SPARK.js";

let datasets = {
  Urban: [
    UrbanTemperature,
    UrbanPower,
    UrbanLocation
  ],
  Proto: [
    ProtoECT,
    ProtoIAT,
    ProtoRPM,
    ProtoUBADC,
    ProtoO2S,
    ProtoSPARK,
    ProtoSpeed,
    ProtoLocation
  ]
};

export default datasets;
