import moment from "moment";
import { chartBuilder } from "../../../helpers/builders.js";
import React from "react";
import Graph from "../../../components/Graph.js";

const Temperature = {
  label: "Temperature",
  id: "URBAN-Temperature",
  handler: function(retval, d) {
    let retVals = d.entity.properties.data.stringValue.split(" ");
    let elem = {};
    elem.y = parseFloat(retVals[0]);
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
    return chartBuilder("#dcedc8", this.label, this.id, data);
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
          id: "Temperature",
          position: "left",
          gridLines: {
            display: true
          },
          scaleLabel: {
            display: true,
            labelString: "Temperature (C)"
          }
        }
      ]
    }
  }
};

export default Temperature;
