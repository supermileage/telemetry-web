import moment from "moment";
import { chartBuilder } from "../../../helpers/builders.js";
import React from "react";
import Graph from "../../../components/Graph.js";

export default {
  label: "ubAdc",
  id: "PROTO-UBADC",
  handler: function(retval, d) {
    let elem = {};
    elem.y = parseFloat(d.entity.properties.data.stringValue);
    elem.x = moment(d.entity.properties.recorded_at.stringValue);

    // Check if the last element was greater than 10 minutes ago, we disjoint it then
    if (
      retval.length > 0 &&
      elem.x.unix() - moment(retval[retval.length - 1].x).unix() > 600
    ) {
      retval.push({
        y: NaN,
        x: elem.x
      });
    }
    retval.push(elem);
  },
  parser: function(data) {
    return chartBuilder("#8c9eff", this.label, this.id, data);
  },
  element: function(data) {
    return <Graph key={this.id} data={data || {}} options={this.options} />;
  },
  options: {
    animation: {
      duration: 500
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            display: true
          },
          type: "time",
          distribution: "linear", // Distances can vary, based on time
          scaleLabel: {
            display: true,
            labelString: "Time"
          }
        }
      ],
      yAxes: [
        {
          id: "PROTO-UBADC",
          position: "left",
          gridLines: {
            display: true
          },
          scaleLabel: {
            display: true,
            labelString: "V"
          }
        }
      ]
    }
  }
};
