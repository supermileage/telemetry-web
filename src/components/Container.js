import React from "react";
import Toggle from "./Toggle.js";
import Button from "./Button.js";
import moment from "moment";
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
      dropdownOpen: false,
      data: {},
      car: "Urban"
    };
  }

  componentDidMount = () => {
    document.addEventListener("click", e => {
      if (!e.target.matches(".dropdown-trigger *")) {
        if (this.state.dropdownOpen) {
          this.setDropdownState(false);
        }
      }
    });
  };

  setDropdownState = dropState => {
    this.setState({
      dropdownOpen: dropState
    });
  };

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
      this.timeout = setTimeout(this.intervalHandler, config.refreshInterval);
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

    for (let dataset of config.datastore.datasets[this.state.car]) {
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

  changeCar = e => {
    if (e.target.id !== this.state.car) {
      this.setState({
      car: e.target.id,
        data: {}
      });
    }
  };

  populateCars = () => {
    let ret = [];
    for (let car in config.datastore.datasets) {
      ret.push(
        <a
          className="dropdown-item"
          id={car}
          key={car}
          onClick={this.changeCar}
        >
          {car}
        </a>
      );
    }
    return ret;
  };

  render = () => {
    return (
      <div>
        <div className="container notification control">
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
              <div className="columns is-mobile is-vcentered is-multiline">
                <div className="toggle column is-narrow">
                  <Toggle
                    defaultChecked={this.state.liveMode}
                    onChange={this.liveUpdateHandler}
                  />
                </div>
                <div className="column is-narrow">
                  <div
                    className={
                      "dropdown" +
                      (this.state.dropdownOpen ? " is-active" : "")
                    }
                  >
                    <div
                      className="dropdown-trigger"
                      onClick={() => {
                        this.setDropdownState(!this.state.dropdownOpen);
                      }}
                    >
                      <button className="button" controls="dropdown-menu">
                        <span>{this.state.car}</span>
                        <span className="icon is-small">
                          <i className="fas fa-angle-down"></i>
                        </span>
                      </button>
                    </div>
                    <div
                      className="dropdown-menu"
                      id="dropdown-menu"
                      role="menu"
                    >
                      <div className="dropdown-content">
                        {this.populateCars()}
                      </div>
                    </div>
                  </div>
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
        <div className="container">
          <div className="columns is-desktop is-multiline">
            {config.datastore.datasets[this.state.car].map((dataset, index) => {
              return dataset.element(this.state.data[dataset.id]);
            })}
          </div>
        </div>
      </div>
    );
  };
}
