import React from "react";
import "../css/datetime.css";
import Datetime from "react-datetime";

export default class DayRange extends React.Component {
  // Render my pickers; all the state is lifted up into
  // the parent element, thus all the changes are handled
  // by props; this element does not have state
  render = () => {
    console.log("Rerender");
    return (
      <div className="columns">
        <div className="column">
          <Datetime
            className="input"
            type="date"
            onChange={this.props.onChangeStart}
            value={this.props.startTime}
          />
        </div>
        <div className="column">
          <Datetime
            className="input"
            type="date"
            onChange={this.props.onChangeEnd}
            inputProps={{
              disabled: this.props.endTime === null
            }}
            value={this.props.endTime === null ? "Current" : this.props.endTime}
          />
        </div>
      </div>
    );
  };
}
