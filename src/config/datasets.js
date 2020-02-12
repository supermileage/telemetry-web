import UrbanTemperature from "./datasets/Urban/Temperature.js";
import UrbanPower from "./datasets/Urban/Power.js";
import UrbanLocation from "./datasets/Urban/Location.js";

import ProtoSpeed from "./datasets/Proto/Speed.js";
import ProtoLocation from "./datasets/Proto/Location.js";

let datasets = {
  Urban: [
    UrbanTemperature,
    UrbanPower,
    UrbanLocation
  ],
  Proto: [
    ProtoSpeed,
    ProtoLocation
  ]
};

export default datasets;
