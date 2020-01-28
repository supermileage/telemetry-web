import React from "react";
import "bulma-switch/dist/css/bulma-switch.min.css";

export default class Toggle extends React.Component {
  render = () => {
    return (
      <div className="field">
        <input
          id="switch"
          className="switch is-medium"
          type="checkbox"
          onChange={this.props.onChange}
          checked={this.props.defaultChecked}
        />
        <label htmlFor="switch"></label>
      </div>
    );
  };
}
