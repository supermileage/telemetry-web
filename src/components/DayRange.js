import React from "react";
import moment from "moment";
import { DatetimePickerTrigger } from "rc-datetime-picker";
import '../css/datetime.css';

export default class DayRange extends React.Component {
  // Render my pickers; all the state is lifted up into
  // the parent element, thus all the changes are handled
  // by props; this element does not have state
  render = () => {
    const shortcuts = {
      Today: moment(),
      Yesterday: moment().subtract(1, "days")
    };
    return (
      <div className="columns">
        <div className="column">
          <DatetimePickerTrigger
            className="input is-rounded is-small"
            shortcuts={shortcuts}
            moment={this.props.startTime}
            onChange={this.props.onChangeStart}
          >
            <input
              type="text"
              value={this.props.startTime.format("YYYY-MM-DD HH:mm")}
              readOnly
            />
          </DatetimePickerTrigger>
        </div>
        <div className="column">
          <DatetimePickerTrigger
            className="input is-rounded is-small"
            shortcuts={shortcuts}
            moment={this.props.endTime}
            onChange={this.props.onChangeEnd}
            disabled={this.props.endTime === null ? true : false}
          >
            <input
              type="text"
              value={
                this.props.endTime === null
                  ? "Current"
                  : this.props.endTime.format("YYYY-MM-DD HH:mm")
              }
              readOnly
              disabled={this.props.endTime === null ? true : false}
            />
          </DatetimePickerTrigger>
        </div>
      </div>
    );
  }
}
