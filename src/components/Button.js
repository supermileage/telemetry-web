import React from "react";

export default class Button extends React.Component {
  render = () => {
    return this.props.liveMode || this.props.updating ? (
      <button
        className="button is-info is-loading"
        onClick={this.props.getDataHandler}
        disabled
      >
        Update
      </button>
    ) : (
      <button
        className="button is-info"
        onClick={this.props.getDataHandler}
      >
        Update
      </button>
    );
  };
}
