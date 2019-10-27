import React from "react";
import Toggle from "react-toggle";
import Button from "./Button.js";
import moment from "moment";
import "../css/toggle.css";
import config from "../config/config.js";
import { queryBuilder } from "../helpers/builders.js";
import DayRange from "./DayRange.js";

export default class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: moment(),
      endTime: moment(),
      liveMode: false,
      updating: false,
      data: {}
    };
  }

  // Handler functions for our starttime change, which
  // our dayrange will receieve as a prop
  startTimeChangeHandler = time => {
    this.setState({
      startTime: time
    });
  };

  endTimeChangeHandler = time => {
    this.setState({
      endTime: time
    });
  };

  // Handle the current boolean for "live" plotting
  liveUpdateHandler = e => {
    if (e.target.checked) {
      this.setState({
        liveMode: true,
        endTime: null
      });
      this.intervalHandler();
    } else {
      clearTimeout(this.timeout);
      this.setState({
        liveMode: false
      });
      this.endTimeChangeHandler(moment());
    }
  };

  intervalHandler = async () => {
    await this.updateMetrics();
    if (this.state.liveMode) {
      this.timeout = setTimeout(this.intervalHandler, 2000);
    }
  };

  getDataHandler = async (lastCursor, retval, dataset, handler) => {
    let req = queryBuilder(
      this.state.liveMode,
      this.state.startTime,
      this.state.endTime,
      dataset
    );

    if (lastCursor !== null) req.query.startCursor = lastCursor;

    let response = await fetch(
      config.datastore.getQueryUrl(),
      config.datastore.generatePayload(this.props.token, JSON.stringify(req))
    );

    let json = await response.json();

    try {
      if ("entityResults" in json.batch) {
        json.batch.entityResults.forEach(d => {
          handler(retval, d);
        });
      }

      // There are still results remaining
      if (json.batch.moreResults === "NOT_FINISHED") {
        return await this.getDataHandler(
          json.batch.endCursor,
          retval,
          dataset,
          handler
        );
      }
    } catch (error) {
      console.log(error);
    }
    return retval;
  };

  getData = async () => {
    let newData = {};

    for (let dataset of config.datastore.datasets) {
      let data = await this.getDataHandler(
        null,
        [],
        dataset.id,
        dataset.handler
      );
      newData[dataset.id] = dataset.parser(dataset.label, dataset.id, data);
    }

    return newData;
  };

  updateMetrics = async () => {
    this.setState({
      updating: true
    });

    let newData = await this.getData();

    this.setState({
      updating: false,
      data: newData
    });
  };

  render = () => {
    return (
      <div>
        <div className="container notification">
          <div className="columns">
            <div className="column is-narrow">
              <DayRange
                startTime={this.state.startTime}
                endTime={this.state.endTime}
                onChangeStart={this.startTimeChangeHandler}
                onChangeEnd={this.endTimeChangeHandler}
              />
            </div>
            <div className="column">
              <div className="columns is-mobile">
                <div className="toggle column is-narrow">
                  <Toggle
                    defaultChecked={this.state.liveMode}
                    onChange={this.liveUpdateHandler}
                  />
                </div>
                <div className="column is-narrow">
                  <Button
                    liveMode={this.state.liveMode}
                    getDataHandler={this.updateMetrics}
                    updating={this.state.updating}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {config.datastore.datasets.map((dataset, index) => {
          return (
            <div
              className="container notification has-background-white-bis"
              key={index}
            >
              {dataset.element(this.state.data[dataset.id])}
            </div>
          );
        })}
      </div>
    );
  };
}
